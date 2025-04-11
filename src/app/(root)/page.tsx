import InterviewCard from "@/components/interview-card";
import { Button } from "@/components/ui/button";
import { dummyInterviews } from "@/constants";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <section className="card-cta">
        <div className="flex flex-col gap-6 max-w-lg">
          <h2>Get Interview-Ready with AI-Powered Practice & Feedback</h2>
          <p className="text-lg">
            Practice on real interview questions & get instant feedback
          </p>
          <Button asChild className="btn-primary max-sm:w-full">
            <Link href="/interview">Start an interview</Link>
          </Button>
        </div>
        <Image
          src={"/robot.png"}
          alt="robo img"
          width={400}
          height={400}
          className="max-sm:hidden"
          priority
        />
      </section>
      <section className="flex flex-col gap-6 mt-8">
        <h2 className="">Your interviews</h2>
        <div className="interviews-section">
          {dummyInterviews.map((interview) => (
            <InterviewCard {...interview} key={interview.id} />
          ))}
        </div>
      </section>
      <section className="flex flex-col gap-6 mt-8">
        <h2 className="">Take an interview</h2>
        <div className="interviews-section">
          {dummyInterviews.map((interview) => (
            <InterviewCard {...interview} key={interview.id} />
          ))}
          {/* <p className="">Thier are no interviews available</p> */}
        </div>
      </section>
    </>
  );
}
