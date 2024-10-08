import { z } from 'zod';

export const personalInfoSchema = z.object({
  firstName: z.string().min(3).max(48),
  lastName: z.string().min(3).max(48),
  email: z.string().email(),
  phoneNumber: z.string(),
  country: z.string(),
  city: z.string(),
  streetAddress: z.string(),
  postCode: z.string(),
});

export const signInSchema = z.object({
  email: z.string({ required_error: 'Email is a required field!' }).email(),
  password: z.string({ required_error: 'Password is a required field!' }),
});

export const signUpSchema = z
  .object({
    email: z.string({ required_error: 'Email is a required field!' }).email(),
    password: z.string({ required_error: 'Password is a required field!' }),
    confirmPassword: z.string({
      required_error: 'Password must be confirmed!',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match!",
    path: ['confirmPassword'],
  });

export const forgotPasswordSchema = z.object({
  email: z.string({ required_error: 'Email is a required field!' }),
});

export const reviewSchema = z.object({
  title: z.string(),
  content: z.string(),
  rating: z.number().min(1).max(5),
});

export const resetPasswordSchema = z.object({
  newPassword: z.string({
    required_error: 'Mew password is a required field!',
  }),
  confirmNewPassword: z.string({
    required_error: 'New password must be confirmed!',
  }),
});
