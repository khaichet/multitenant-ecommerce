import z from "zod"

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string()

})

export const registerSchema = z.object({
    email: z.string().email("Email không hợp lệ"),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    username: z.string()
        .min(3, "Username phải có ít nhất 3 ký tự")
        .max(53, "Username phải ít hơn 53 ký tự")
        .regex(
            /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/,
            "Username chỉ chứa chữ thường, số và dấu gạch ngang, và phải bắt đầu/kết thúc bằng chữ hoặc số"
        )
        .refine(
            (val) => !val.includes("--"),
            { message: "Username không được chứa 2 dấu gạch ngang liên tiếp" }
        )
        .transform((val) => val.toLowerCase()),
})
