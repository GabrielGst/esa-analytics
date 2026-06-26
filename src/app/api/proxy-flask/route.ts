import { NextRequest, NextResponse } from 'next/server';

import { auth } from "@/auth"

import { AuthenticatedRequest } from '@/../next-auth';
import { dataPayload } from '@/lib/types';


export const POST = auth(async function POST( req: AuthenticatedRequest ) {

  if (req.auth?.user.group_membership === 'authorized') {
    try {
      const { route, inputData } = await req.json();

      // console.log('route:', route);
      // console.log('inputData:', inputData);

      const flaskRes = await fetch(
        (process.env.FLASK_INTERNAL_URL ?? 'http://127.0.0.1:5050') + '/flask/' + route,
        {
          method: req.method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(inputData)
        });

      const { message, fetchData } = await flaskRes.json();

      return NextResponse.json({
        message,
        fetchData
      });

    } catch (err) {
      console.error('Error parsing body:', err);
      return new NextResponse(
        JSON.stringify({ error: 'Invalid request body' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } else {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
  }
})


export const GET = auth(async function GET( req: AuthenticatedRequest ) {

  if (req.auth?.user.group_membership === 'authorized') {
    try {
      const flaskRes = await fetch(
        (process.env.FLASK_INTERNAL_URL ?? 'http://127.0.0.1:5050') + '/flask/healthchecker/',
        {
          method: 'GET',
        })      
    
      const response = await flaskRes.json();

      return NextResponse.json({
        response
      });
    } catch (err) {
      console.error('Error parsing body:', err);
      return new NextResponse(
        JSON.stringify({ error: 'Invalid request body' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } else {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
  }

})