import { Question } from "@prisma/client";
import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { cn } from "@/lib/utils";

type Props = {
  questions: Question[];
};

const QuestionsList = ({ questions }: Props) => {
  const gameType = questions[0]?.questionType || "mcq"; // Default to "mcq" if questionType is not defined

  return (
    <Table className="mt-4">
      <TableCaption>End of List.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[10px]">No.</TableHead>
          <TableHead>Question & Correct Answer</TableHead>
          <TableHead>Your Answer</TableHead>
          {gameType === "open_ended" && (
            <TableHead className="w-[10px] text-right">Accuracy</TableHead>
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {questions.map((question, index) => (
          <TableRow key={question.id}>
            <TableCell className="font-medium">{index + 1}</TableCell>
            <TableCell>
              {question.question}
              <br />
              <br />
              <span className="font-semibold">{question.answer}</span>
            </TableCell>
            {gameType === "mcq" && (
              <TableCell
                className={cn({
                  "text-green-600": question.isCorrect,
                  "text-red-600": !question.isCorrect,
                })}
              >
                {question.userAnswer}
              </TableCell>
            )}
            {gameType === "open_ended" && (
              <>
                <TableCell>{question.userAnswer}</TableCell>
                <TableCell className="text-right">
                  {question.percentageCorrect}
                </TableCell>
              </>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default QuestionsList;
