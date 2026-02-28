"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import * as z from "zod";
import { signInSchema } from "@/schema";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "./ui/field";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Link from "next/link";
import { Separator } from "./ui/separator";
import { signIn } from "@/actions/auth.action";

const SignInForm = () => {
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof signInSchema>) {
    // Do something with the form values.
    await signIn(data);
  }
  return (
    <Card className="w-full md:w-2/3 lg:w-1/3">
      <CardHeader className="px-4 space-y-0">
        <CardTitle className="text-2xl text-gray-200">
          Welcome Back,👋 <br />
          <span className="text-xl">Sign in to your account</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          id="signin"
          className="space-y-3"
        >
          <FieldGroup>
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="johnDoe@gmail.com"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="john@123"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <Field orientation="horizontal">
          <Button type="submit" form="signin" className="cursor-pointer w-full">
            Login
          </Button>
        </Field>
        <Separator className="mt-3.5" />
        <small>
          Don't have an account?{" "}
          <Link href="/sign-up" className="underline">
            Sign Up
          </Link>
        </small>
      </CardFooter>
    </Card>
  );
};

export default SignInForm;
