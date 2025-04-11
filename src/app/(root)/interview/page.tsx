import Agent from "@/components/agent";
import React from "react";

const InterviewPage = () => {
  return (
    <>
      <h3>Interview generation</h3>
      <Agent userName="you" userId="1" type="generate" />
    </>
  );
};

export default InterviewPage;
