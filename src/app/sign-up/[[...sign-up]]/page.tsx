import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 md:-translate-y-1/2 -translate-y-2/3">
        <SignUp></SignUp>
    </div>
  );
}
