import { Request, Response } from "express";
import prisma from "../lib/prisma.js";
import openai, { AI_MODEL } from "../configs/openai.js";
import Stripe from "stripe";

// Get User Credits
export const getUserCredits = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    res.json({ credits: user?.credits });
  } catch (error: any) {
    console.log(error.code || error.message);
    res.status(500).json({ message: error.message });
  }
};

// Controller Function to create New Project

export const createUserProject = async (req: Request, res: Response) => {
  const userId = req.userId;
  let project: Awaited<ReturnType<typeof prisma.websiteProject.create>> | null =
    null;
  try {
    const { initial_prompt, lang = "en" } = req.body;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (user && user.credits < 5) {
      return res
        .status(403)
        .json({ message: "add credits to create more projects" });
    }

    // Create a new project
    project = await prisma.websiteProject.create({
      data: {
        name:
          initial_prompt.length > 50
            ? initial_prompt.substring(0, 47) + "..."
            : initial_prompt,
        initial_prompt,
        userId,
      },
    });

    // Update User's Total Creation

    await prisma.user.update({
      where: { id: userId },
      data: { totalCreation: { increment: 1 } },
    });

    await prisma.conversation.create({
      data: {
        role: "user",
        content: initial_prompt,
        projectId: project.id,
      },
    });

    await prisma.user.update({
      where: { id: userId },
      data: { credits: { decrement: 5 } },
    });

    res.json({ projectId: project.id });

    const uiLang = lang === "pt-BR" ? "Brazilian Portuguese" : lang === "es" ? "Spanish" : "English";

    // Enhance user prompt
    const promptEnhanceResponse = await openai.chat.completions.create({
      model: AI_MODEL,
      messages: [
        {
          role: "system",
          content: `You are a prompt enhancement specialist. Take the user's website request and expand it into a detailed, comprehensive prompt that will help create the best possible website.
          Enhance this prompt by: 
          1. Adding specific design details (layout, color scheme, typography)
          2. Specifying key sections and features
          3. Describing the user experience and interactions
          4. Mentioning responsive design requirements
          6. Adding any missing but important elements

          Return ONLY the enhanced prompt, nothing else. Make it detailed but concise (2-3 paragraphs max).
          `,
        },
        {
          role: "user",
          content: initial_prompt,
        },
      ],
    });

    const enhancedPrompt = promptEnhanceResponse.choices[0].message.content;

    await prisma.conversation.create({
      data: {
        role: "assistant",
        content: lang === "pt-BR"
          ? `Melhorei seu prompt para: "${enhancedPrompt}"`
          : lang === "es"
          ? `Mejoré tu prompt a: "${enhancedPrompt}"`
          : `I've enhanced your prompt to: "${enhancedPrompt}"`,
        projectId: project.id,
      },
    });

    await prisma.conversation.create({
      data: {
        role: "assistant",
        content: lang === "pt-BR"
          ? "Gerando seu site..."
          : lang === "es"
          ? "Generando tu sitio web..."
          : "Generating your website...",
        projectId: project.id,
      },
    });

    // Generate website code

    const codeGenerationResponse = await openai.chat.completions.create({
      model: AI_MODEL,
      messages: [
        {
          role: "system",
          content: `You are an expert web developer. Output ONLY a complete HTML document. No explanations, no markdown, no code fences — raw HTML only.

Build a responsive, beautiful single-page website for: "${enhancedPrompt}"

TECHNICAL STACK:
- Tailwind CSS via <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script> in <head>
- Interactive JS in <script> before </body>
- Google Fonts CDN if needed
- Placeholder images: https://placehold.co/600x400 with descriptive alt text

SEO — include all of these in <head>:
- <title> (50-60 chars, business name)
- <meta name="description" content="..."> (150-160 chars)
- <meta property="og:title">, <meta property="og:description">, <meta property="og:type" content="website">, <meta property="og:image" content="https://placehold.co/1200x630">
- <meta name="twitter:card" content="summary_large_image">, <meta name="twitter:title">, <meta name="twitter:description">
- <link rel="canonical" href="#">
- <script type="application/ld+json"> with WebPage schema (or LocalBusiness for stores/restaurants/clinics, or Person for portfolios)

OUTPUT RULE: first character must be < and last character must be >.`,
        },
        {
          role: "user",
          content: enhancedPrompt || "",
        },
      ],
    });

    const rawCode = codeGenerationResponse.choices[0].message.content || "";
    const code = rawCode.replace(/```[a-z]*\n?/gi, "").replace(/```$/g, "").trim();

    const isValidHTML = code.includes("<html") || code.includes("<!DOCTYPE");

    if (!code || !isValidHTML) {
      await prisma.conversation.create({
        data: {
          role: "assistant",
          content: lang === "pt-BR"
            ? "Não foi possível gerar o código, tente novamente"
            : lang === "es"
            ? "No se pudo generar el código, inténtalo de nuevo"
            : "Unable to generate the code, please try again",
          projectId: project.id,
        },
      });
      await prisma.user.update({
        where: { id: userId },
        data: { credits: { increment: 5 } },
      });
      return;
    }

    // Create Version for the project
    const version = await prisma.version.create({
      data: {
        code,
        description: "Initial version",
        projectId: project.id,
      },
    });

    await prisma.conversation.create({
      data: {
        role: "assistant",
        content:
          lang === "pt-BR"
            ? "Seu site foi criado! Visualize o resultado e peça alterações quando quiser."
            : lang === "es"
            ? "¡Tu sitio web fue creado! Previsualízalo y solicita cambios cuando quieras."
            : "I've created your website! You can now preview it and request any changes.",
        projectId: project.id,
      },
    });

    await prisma.websiteProject.update({
      where: { id: project.id },
      data: {
        current_code: code,
        current_version_index: version.id,
      },
    });
  } catch (error: any) {
    console.log(error);
    if (!res.headersSent) {
      if (userId) {
        await prisma.user.update({
          where: { id: userId },
          data: { credits: { increment: 5 } },
        });
      }
      res.status(500).json({ message: error.message });
    } else if (project && userId) {
      // Response already sent — record the failure so the client stops polling
      try {
        await prisma.conversation.create({
          data: {
            role: "assistant",
            content:
              lang === "pt-BR"
                ? "Ocorreu um erro ao gerar seu site. Por favor, tente novamente."
                : lang === "es"
                ? "Ocurrió un error al generar tu sitio web. Por favor, inténtalo de nuevo."
                : "Sorry, I encountered an error while generating your website. Please try again.",
            projectId: project.id,
          },
        });
        await prisma.user.update({
          where: { id: userId },
          data: { credits: { increment: 5 } },
        });
      } catch (dbError) {
        console.log("Failed to record generation error:", dbError);
      }
    }
  }
};

// Controller Function to Get A Single User Project
// Duplicate getUserProject removed

// Controller Function to Get All Users Projects
export const getUserProjects = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const projects = await prisma.websiteProject.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
    });

    res.json({ projects });
  } catch (error: any) {
    console.log(error.code || error.message);
    res.status(500).json({ message: error.message });
  }
};

// Controller Function to Toggle project Publish
export const getUserProject = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    let { projectId } = req.params;
    // If projectId is an array (shouldn't be), use the first element
    if (Array.isArray(projectId)) projectId = projectId[0];

    const project = await prisma.websiteProject.findUnique({
      where: { id: projectId },
      include: {
        conversation: {
          orderBy: {
            timestamp: "asc",
          },
        },
        versions: {
          orderBy: {
            timestamp: "asc",
          },
        },
      },
    });

    // Optionally, check userId matches for security
    if (!project || project.userId !== req.userId) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json({ project });
  } catch (error: any) {
    console.log(error.code || error.message);
    res.status(500).json({ message: error.message });
  }
};

// Controller Function to Toggle Project Publish
export const togglePublish = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    let { projectId } = req.params;
    if (Array.isArray(projectId)) projectId = projectId[0];

    const project = await prisma.websiteProject.findUnique({
      where: { id: projectId },
    });

    if (!project || project.userId !== userId) {
      return res.status(404).json({ message: "Project not found" });
    }

    await prisma.websiteProject.update({
      where: { id: projectId },
      data: { isPublished: !project.isPublished },
    });

    res.json({
      message: project.isPublished
        ? "Project Unpublished"
        : "Project Published Successfully",
    });
  } catch (error: any) {
    console.log(error.code || error.message);
    res.status(500).json({ message: error.message });
  }
};

// Controller Function to Purchase Credits
export const purchaseCredits = async (req: Request, res: Response) => {
  try {
    interface PlanVariant {
      credits: number;
      amount: number;
      currency: string;
      label: string;
    }

    // BRL amounts are competitive for the Brazilian market
    const plans: Record<string, { usd: PlanVariant; brl: PlanVariant }> = {
      basic: {
        usd: { credits: 100, amount: 5,  currency: "usd", label: "100 credits" },
        brl: { credits: 100, amount: 19, currency: "brl", label: "100 créditos" },
      },
      pro: {
        usd: { credits: 400, amount: 19, currency: "usd", label: "400 credits" },
        brl: { credits: 400, amount: 49, currency: "brl", label: "400 créditos" },
      },
      enterprise: {
        usd: { credits: 1000, amount: 49, currency: "usd", label: "1000 credits" },
        brl: { credits: 1000, amount: 97, currency: "brl", label: "1000 créditos" },
      },
    };

    const userId = req.userId;
    const { planId, locale } = req.body as { planId: string; locale?: string };
    const origin = req.headers.origin as string;

    const planGroup = plans[planId];
    if (!planGroup) {
      return res.status(404).json({ message: "Plan not found" });
    }

    const variant = locale === "pt-BR" ? planGroup.brl : planGroup.usd;

    const transaction = await prisma.transaction.create({
      data: {
        userId: userId!,
        planId,
        amount: variant.amount,
        credits: variant.credits,
      },
    });

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/loading`,
      cancel_url: `${origin}`,
      line_items: [
        {
          price_data: {
            currency: variant.currency,
            product_data: {
              name: `Nexio AI Site Builder — ${variant.label}`,
            },
            unit_amount: Math.floor(variant.amount) * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      metadata: {
        transactionId: transaction.id,
        appId: "ai-site-builder",
      },
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
    });

    res.json({ payment_link: session.url });
  } catch (error: any) {
    console.log(error.code || error.message);
    res.status(500).json({ message: error.message });
  }
};
