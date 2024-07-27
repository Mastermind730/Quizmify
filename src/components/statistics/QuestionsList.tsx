import { Question } from '@prisma/client'
import React from 'react'

type Props = {
    questions:Question[]
};

const QuestionsList = (props: Props) => {
  return (
    <div>QuestionsList</div>
  )
}

export default QuestionsList