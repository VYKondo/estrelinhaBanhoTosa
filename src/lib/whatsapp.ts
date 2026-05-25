export const sendWhatsappTemplate = async (
  phone: string,
  templateName: string,
  variables: Record<string, string>
) => {
  const url = `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_ID}/messages`;

  const components = Object.entries(variables).map(([key, value]) => ({
    type: "body",
    parameters: [{ type: "text", text: value }],
  }));

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.WHATSAPP_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: phone,
      type: "template",
      template: {
        name: templateName,
        language: { code: "pt_BR" },
        components: components,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to send WhatsApp message: ${JSON.stringify(error)}`);
  }

  return response.json();
};
