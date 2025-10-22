"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useRouter } from "next/navigation";
import React from "react";
import { Button } from "../ui/button";

const NotFoundUi = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push("/");
  };

  return (
    <div className="flex justify-center  w-full  p-4">
      <div className="flex flex-col items-center">
        <DotLottieReact
          loop
          src="/not_found.json"
          autoplay
          className="w-[300px] h-[300px]"
        />
        <Button variant={"default"} onClick={handleClick}>
          <span>Back</span>
        </Button>
      </div>
    </div>
  );
};

export default NotFoundUi;
