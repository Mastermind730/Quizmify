import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { getAuthSession } from '@/lib/nextauth'
import { LucideLayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React from 'react'

type Props = {}

const page = async(props: Props) => {
    const session=await getAuthSession();
    if(!session?.user){
        return redirect("/")
    }
  return (
    <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className='text-2xl font-bold'>
                        History
                    </CardTitle>
                    <Link href={"/dashboard"}>
                    <LucideLayoutDashboard className='mr-2'/>
                    Back to Dashboard
                    </Link>
                </div>
            </CardHeader>
        </Card>
    </div>
  )
}

export default page