import { SignIn } from "@clerk/clerk-react";

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F6F7FB] dark:bg-[#0B1120] px-4">

      <div>

        <SignIn
          afterSignInUrl="/feed"
          afterSignUpUrl="/feed"

         
        />

      </div>

    </div>
  );
};

export default Login;
