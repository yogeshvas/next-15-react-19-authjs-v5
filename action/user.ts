"use server";

import connectDB from "@/lib/db";
import { User } from "@/models/user";
import { redirect } from "next/navigation";
import { hash } from "bcryptjs";
import { CredentialsSignin } from "next-auth";
import { signIn } from "@/auth";
const register = async (formdata: FormData) => {
  const firstName = formdata.get("firstname");
  const lastName = formdata.get("lastname");
  const email = formdata.get("email");
  const password = formdata.get("password")?.toString();
  console.log(firstName, lastName, email, password);
  if (!firstName || !lastName || !email || !password) {
    throw new Error("Please fill all the feilds");
  }

  await connectDB();

  //   existing user
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User Already Exists");
  }
  const hashpassword = await hash(password, 10);
  const user = await User.create({
    firstName,
    lastName,
    email,
    password: hashpassword,
  });

  console.log("user created successfully");
  redirect("/login");
};

const login = async (formdata: FormData) => {
  const email = formdata.get("email") as string;
  const password = formdata.get("password") as string;
  try {
    await signIn("credentials", {
      redirect: false,
      callbackUrl: "/",
      email,
      password,
    });
  } catch (error) {
    const someError = error as CredentialsSignin;
    return someError.cause;
  }
  redirect("/");
};

export { register, login };
