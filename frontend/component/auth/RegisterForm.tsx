"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/app/network";
import TTextField from "@/component/common/TTextField";
import TButton from "@/component/common/TButton";
import { authFlow } from "@/lib/authflow";
import { emailValidator, passwordValidator } from "@/utils";
import en, { TRegisterTranslation } from "@/app/register/i18n/en.i18n";
import ar from "@/app/register/i18n/ar.i18n";
import {
  default as EnTextField,
  TTextFieldTranslation,
} from "@/component/i18n/TTextField/en.i18n";
import { default as ArTextField } from "@/component/i18n/TTextField/ar.i18n";
import { useTranslation } from "@/Hooks/useTranslation";
import { TFieldRegister } from "@/types";

export default function RegisterForm() {
  const router = useRouter();
  const t = useTranslation({
    en: { ...en, ...EnTextField },
    ar: { ...ar, ...ArTextField },
  }) as TRegisterTranslation & TTextFieldTranslation;
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    username: "",
  });
  const validate = (
    emailVal: string,
    passwordVal: string,
    firstNameVal: string,
    lastNameVal: string,
    usernameVal: string,
  ) => {
    return {
      email: emailValidator(t)(emailVal) || "",
      password: passwordValidator(t)(passwordVal) || "",
      firstName: firstNameVal.trim() ? "" : t.dynamicFieldRequired(t.firstName),
      lastName: lastNameVal.trim() ? "" : t.dynamicFieldRequired(t.lastName),
      username: usernameVal.trim() ? "" : t.dynamicFieldRequired(t.username),
    };
  };
  const handleChange = (field: TFieldRegister, value: string) => {
    if (field == "email") setEmail(value);
    if (field == "password") setPassword(value);
    if (field == "firstName") setFirstName(value);
    if (field == "lastName") setLastName(value);
    if (field == "username") setUsername(value);
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };
  const register = async () => {
    const nextErrors = validate(email, password, firstName, lastName, username);
    setErrors(nextErrors);
    if (Object.values(nextErrors).some((error) => error)) return;
    setLoading(true);
    await api.post("/auth/register", {
      email,
      password,
      firstName,
      lastName,
      username,
    });

    authFlow.set({
      email,
      register: { firstName, lastName, username, password },
    });

    router.push("/verify-email");
  };

  return (
    <div className="space-y-3">
      <pre>{JSON.stringify(errors, null, 2)}</pre>
      <TTextField
        label="First name"
        value={firstName}
        required
        error={errors.firstName}
        onChange={(value) => handleChange("firstName", value)}
      />

      <TTextField
        label="Last name"
        value={lastName}
        required
        error={errors.lastName}
        onChange={(value) => handleChange("lastName", value)}
      />

      <TTextField
        label="Username"
        value={username}
        required
        error={errors.username}
        onChange={(value) => handleChange("username", value)}
      />

      <TTextField
        label="Email"
        value={email}
        required
        error={errors.email}
        onChange={(value) => handleChange("email", value)}
      />

      <TTextField
        label="Password"
        type="password"
        value={password}
        required
        error={errors.password}
        onChange={(value) => handleChange("password", value)}
      />

      <TButton
        title={loading ? "Creating..." : "Create"}
        loading={loading}
        onClick={register}
      />
      <div className="text-sm text-center">
        {t.haveAccount}{" "}
        <a href="/login" className="text-primary font-medium">
          {t.signIn}
        </a>
      </div>
    </div>
  );
}
