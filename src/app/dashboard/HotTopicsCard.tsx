import CustomWordCloud from '@/components/CustomWordCloud'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'
import prisma from "@/lib/prismadb"
type Props = {}

const HotTopicsCard = async(props: Props) => {
  const topics=await prisma.topicCount.findMany({})
  const formattedTopics=topics.map(topic=>{
    return{
      text:topic.topic,
      value:topic.count
    }
  })

  console.log(formattedTopics);
  return (
    <Card className='col-span-4'>
        <CardHeader>
            <CardTitle className='text-2xl font-bold'>
Hot Topics
            </CardTitle>
            <CardDescription>
                Click on a topic to start a quiz on it!
            </CardDescription>
        </CardHeader>
        <CardContent className='pl-2'>
<CustomWordCloud formattedTopics={formattedTopics}/>
        </CardContent>
    </Card>
  )
}

export default HotTopicsCard