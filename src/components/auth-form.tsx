/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import FormField from "./form-field";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "@firebase/auth";
import { auth } from "@/firebase/client";
import { signIn, signUp } from "@/lib/actions/auth.action";

const authFormSchema = (type: FormType) => {
  return z.object({
    name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(3),
  });
};

const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter();
  const formSchema = authFormSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (type === "sign-up") {
        const { name, email, password } = values;

        const userCredentials = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const result = await signUp({
          uid: userCredentials.user.uid,
          email,
          name: name!,
          password: password!,
        });

        if (!result?.success) {
          toast.error(result?.message);
          return;
        }

        toast.success("Account created successfully!");
        router.push("/sign-in");
        console.log(values);
      } else {
        const { email, password } = values;
        const userCredentials = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const idToken = await userCredentials.user.getIdToken();
        if (!idToken) {
          toast.error("Failed to get id token");
        }
        const result = await signIn({
          email,
          idToken: idToken,
        });
        if (!result?.success) {
          toast.error(result?.message);
          return;
        }
        toast.success("Logged in successfully!");
        router.push("/");
      }
    } catch (error: any) {
      console.log(error.message);
      if (error.message === "Firebase: Error (auth/invalid-credential).") {
        toast.error("Invalid email or password");
        return;
      }
      toast.error(`There was an error: ${error.message}`);
    }
  }

  const isSignIn = type === "sign-in";

  return (
    <div className="card-border lg:min-w-[556px]">
      <div className="flex flex-col gap-6 card py-14 px-10">
        <div className="flex flex-row gap-2 justify-center">
          <Image src={"./logo.svg"} alt="logo" height={32} width={38} />
          <h2 className="text-primary-100">Prepwise</h2>
        </div>
        <h3 className="text-center">Practice job interiew with ai</h3>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6 mt-4 form"
          >
            {!isSignIn && (
              <FormField
                control={form.control}
                name="name"
                label="name"
                placeholder="Your name"
                type="text"
              />
            )}
            <FormField
              control={form.control}
              name="email"
              label="Email"
              placeholder="Your email"
              type="email"
            />
            <FormField
              control={form.control}
              name="password"
              label="Password"
              placeholder="Enter your password"
              type="password"
            />
            <Button type="submit" className="btn">
              {isSignIn ? "Sign in" : "Create an account"}
            </Button>
          </form>
        </Form>
        <p className="text-center">
          {isSignIn ? "No account yet!" : "Have an account already?"}

          <Link
            href={isSignIn ? "/sign-up" : "/sign-in"}
            className="font-bold text-user-primary ml-1"
          >
            {isSignIn ? "Sign up" : "Sign in"}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
