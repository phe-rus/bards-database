'use client'

import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { toast } from "../hooks/use-toast";
import { useRouter } from "next/navigation";

export default function Home() {
  const [mongoUrl, setMongoUrl] = useState('');
  const route = useRouter()

  useEffect(() => {
    const storedEmail = localStorage.getItem('email');

    if (storedEmail) {
      handleGetUrl(storedEmail);     // Fetch URL if email is present
    } else {
      handleProfile();               // Fetch profile if no email found
    }
  }, []);  // Empty dependency array means this runs once when the component mounts

  const handleProfile = async () => {
    const token = localStorage.getItem('token');

    const response = await fetch('/api/auth/profile', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    const result = await response.json();

    if (response.ok && result.email) {
      const emailResult = result.email;
      localStorage.setItem('email', emailResult);  // Store email in localStorage
    } else {
      toast({
        title: 'Error',
        description: result.msg
      });
    }
  };

  const handleGetUrl = async (email: string) => {
    const response = await fetch('/api/dbs/geturl', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email }),
    });
    const result = await response.json();
    if (response.ok) {
      setMongoUrl(result.mongoUrl);
      localStorage.setItem('mongoUrl', result.mongoUrl);
      toast({
        title: 'Success',
        description: result.msg
      })
    } else {
      toast({
        title: 'Error',
        description: result.msg
      });
    }
  };

  const handleMongoUrl = async () => {
    const email = localStorage.getItem('email');
    const response = await fetch('/api/dbs/add-address', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ mongoUrl, email }),
    });

    const result = await response.json();

    if (response.ok) {
      toast({
        title: 'Success',
        description: result.msg
      });
      route.push('/databases')
    } else {
      toast({
        title: 'Error',
        description: result.msg
      });
    }
  };

  const handleContinue = async () => {
    route.push('/databases')
  }

  return (
    <section className="container flex flex-col h-screen max-w-full w-full justify-center items-center">
      <div className="flex flex-col gap-5 max-w-md w-full">
        <Input
          placeholder="Input your MongoDB address here"
          className="max-w-full w-full h-12 rounded-[10px] px-5"
          value={mongoUrl}
          onChange={(e) => setMongoUrl(e.target.value)}
        />
        <div className="grid grid-cols-2 gap-3">
          <Button
            size={'lg'}
            variant={'default'}
            className="h-[3.0rem] rounded-full"
            onClick={handleMongoUrl}
          >
            Deploy
          </Button>
          <Button
            size={'lg'}
            variant={'ghost'}
            className="h-[3.0rem] rounded-full bg-muted"
            onClick={handleContinue}
          >
            Continue to bards
          </Button>
        </div>
      </div>
    </section>
  );
}
