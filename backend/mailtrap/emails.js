import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js";
import { client, sender } from "./mailtrap.config.js";

export const sendVerificationEmail = async (email, verificationToken) => {

    const recipient = [{email}]; // client

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

export const sendResetPasswordEmail = async (email, resetURL) => {

    const recipient = [{ email }];

    try {
        const response = await client.send({
            from: sender,
            to: recipient,
            subject: "Reset your password",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
            category: "Password Reset",
        })

        console.log("Email sent successfully", response);
    } catch (error) {
        console.log(`Error sending request to reset password -> ${error}`);
        throw new Error(`Error sending request to reset password email: ${error}`);
    }
}

export const sendResetSuccessEmail = async (email) => {
    const recipient = [{ email }];

    try {
        const response = await client.send({
            from: sender,
            to: recipient,
            subject: "Reset Password Success",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
            category: "Password Reset"
        });

        console.log("Password Reset Email sent successfully", response);
    } catch (error) {
        console.log(`Error in sending reset password -> ${error}`);
        throw new Error(`Error sending reset email ${error}`);
    }
}