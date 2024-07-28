"use client";
import { Game, Question } from "@prisma/client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button, buttonVariants } from "./ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { cn, formatTimeDelta } from "@/lib/utils";
import { differenceInSeconds } from "date-fns";
import { BarChart, ChevronRight, Loader2, Timer } from "lucide-react";
import { useToast } from "./ui/use-toast";
import { checkAnswerSchema } from "@/schemas/form/quiz";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import axios from "axios";
import BlankAnswer from "./BlankAnswer";
import Link from "next/link";

type Props = {
  game: Game & { questions: Pick<Question, "id" | "question" | "answer">[]  };
};

const OpenEnded = ({ game }: Props) => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [hasEnded, setHasEnded] = useState<boolean>(false);
  const [blankAnswers, setBlankAnswers] = useState<String>("");
  const [now, setNow] = useState<Date>(new Date());
  const currentQuestion = useMemo(() => {
    return game.questions[questionIndex];
  }, [game.questions, questionIndex]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!hasEnded) {
        setNow(new Date());
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [hasEnded]);

  const { toast } = useToast();

  const { mutate: checkAnswer, isPending: isChecking } = useMutation({
    mutationFn: async () => {
      let filledAnswer = blankAnswers;
      document.querySelectorAll("#user-blank-input").forEach(input => {
        filledAnswer = filledAnswer.replace("_______", input.value);
        input.value = "";
      });
      const payload: z.infer<typeof checkAnswerSchema> = {
        questionId: currentQuestion.id,
        userAnswer: filledAnswer,
      };
      const response = await axios.post("/api/checkAnswer", payload);
      return response.data;
    },
  });

  const handleNext = useCallback(() => {
    if (isChecking) return;
    checkAnswer(undefined, {
      onSuccess: ({ percentageSimilar }) => {
        toast({
          title: `Your answer is ${percentageSimilar}% similar to the correct answer`,
          description: "Answers are matched based on similarity comparisons",
        });

        setQuestionIndex(prev => prev + 1);

        if (questionIndex === game.questions.length - 1) {
          setHasEnded(true);
        }
      },
    });
  }, [checkAnswer, toast, isChecking, game.questions.length, questionIndex]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        handleNext();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleNext]);

  if (hasEnded) {
    return (
      <div className="absolute flex flex-col justify-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="px-4 mt-2 font-semibold text-white bg-green-500 rounded-md whitespace-nowrap">
          You completed in {formatTimeDelta(differenceInSeconds(now, game.timeStarted))}
        </div>
        <Link href={`/statistics/${game.id}`} className={cn(buttonVariants(), "mt-2")}>
          View Statistics
          <BarChart className="w-4 h-4 ml-2" />
        </Link>
      </div>
    );
  }

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:w-[80vw] max-w-4xl w-[90vw]">
      <div className="flex flex-row justify-between">
        <div className="flex flex-col">
          <p>
            <span className="text-slate-400 mr-2">Topic</span>
            <span className="px-2 py-1 text-white rounded-lg bg-slate-800">
              {game.topic}
            </span>
          </p>
          <div className="flex self-start mt-3 text-slate-400">
            <Timer className="mr-2" />
            {formatTimeDelta(differenceInSeconds(now, game.timeStarted))}
          </div>
        </div>
      </div>
      <Card className="w-full mt-4">
        <CardHeader className="flex flex-row items-center">
          <CardTitle className="mr-5 text-center divide-y divide-zinc-800/50">
            <div>{questionIndex + 1}</div>
            <div className="text-base text-slate-400">
              {game.questions.length}
            </div>
          </CardTitle>
          <CardDescription className="flex-grow text-lg">
            {currentQuestion.question}
          </CardDescription>
        </CardHeader>
      </Card>
      <div className="flex flex-col items-center justify-center w-full mt-4">
        <BlankAnswer answer={currentQuestion.answer} setBlankAnswer={setBlankAnswers} />
        <Button
          disabled={isChecking}
          onClick={handleNext}
          className="mt-2"
        >
          {isChecking && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Next <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default OpenEnded;
