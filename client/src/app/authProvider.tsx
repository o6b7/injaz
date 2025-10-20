import React from "react";
import { Authenticator } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import "@aws-amplify/ui-react/styles.css";

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || "",
      userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID || "",
    },
  },
});

const formFields = {
  signUp: {
    username: {
      order: 1,
      placeholder: "اختر اسم مستخدم",
      label: "اسم المستخدم",
      inputProps: { required: true },
    },
    email: {
      order: 2,
      placeholder: "أدخل بريدك الإلكتروني",
      label: "البريد الإلكتروني",
      inputProps: { type: "email", required: true },
    },
    password: {
      order: 3,
      placeholder: "أدخل كلمة المرور",
      label: "كلمة المرور",
      inputProps: { type: "password", required: true },
    },
    confirm_password: {
      order: 4,
      placeholder: "تأكيد كلمة المرور",
      label: "تأكيد كلمة المرور",
      inputProps: { type: "password", required: true },
    },
    name: {
      order: 5,
      placeholder: "أدخل اسمك الكامل",
      label: "الاسم الكامل",
      inputProps: { required: true },
    },
  },
  signIn: {
    username: {
      placeholder: "أدخل اسم المستخدم أو البريد الإلكتروني",
      label: "اسم المستخدم أو البريد الإلكتروني",
    },
    password: {
      placeholder: "أدخل كلمة المرور",
      label: "كلمة المرور",
    },
  },
};

const AuthProvider = ({ children }: any) => {
  return (
    <div>
      <Authenticator formFields={formFields}>
        {({ user }: any) =>
          user ? (
            <div>{children}</div>
          ) : (
            <div>
              <h1>يرجى تسجيل الدخول أدناه:</h1>
            </div>
          )
        }
      </Authenticator>
    </div>
  );
};

export default AuthProvider;
