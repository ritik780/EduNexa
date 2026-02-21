import { SignIn } from "@clerk/clerk-react";

const Login = () => {
  const redirectUrl = typeof window !== "undefined" ? `${window.location.origin}/feed` : "/feed";

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F6F7FB] dark:bg-[#0B1120] px-4">
      <div>
        <SignIn
          afterSignInUrl={redirectUrl}
          afterSignUpUrl={redirectUrl}
          forceRedirectUrl={redirectUrl}
        />
      </div>
    </div>
  );
};

export default Login;
