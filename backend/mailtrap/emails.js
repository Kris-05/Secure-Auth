import { VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js";
import { client, sender } from "./mailtrap.config.js";

export const sendVerificationEmail = async (email, verificationToken) => {

    const recipient = [{email}];

    try {
        const response = await client.send({
            from: sender,
            to: recipient,
            subject: "Verify your email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
            category: "Email Verification"
        })

        console.log("Email sent successfully", response);
    } catch (error) {
        console.error(`Error sending verification -> ${error}`);
        throw new Error(`Error sending verification email: ${error}`);
    }

}

export const sendWelcomeEmail = async(email, name) => {
    const recipient = [{ email }];

    try {
        const response = await client.send({
            from: sender,
            to: recipient,
            template_uuid: "b3fb44b0-c3e3-4d17-9d4d-13f216bbdda6",
            template_variables: {
                company_info_name: "Luffy-Zoro corp",
                name: name,
                company_info_country: "India",
            },
        });

        console.log("Welcome email sent successfully", response);
    } catch (error) {
        console.error("Error sending welcome email", error);
        throw new Error(`Error sending welcome email: ${error}`);
    }
}