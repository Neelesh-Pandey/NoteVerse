import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { db } from '@/lib/db'


export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.SIGNING_SECRET

  if (!SIGNING_SECRET) {
    throw new Error('Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env')
  }

  // Create new Svix instance with secret
  const wh = new Webhook(SIGNING_SECRET)

  // Get headers
  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing Svix headers', {
      status: 400,
    })
  }

  // Get body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  let evt: WebhookEvent

  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error: Could not verify webhook:', err)
    return new Response('Error: Verification error', {
      status: 400,
    })
  }

  // Do something with payload
  // For this guide, log payload to console
//   const { id } = evt.data
//   const eventType = evt.type
//   console.log(`Received webhook with ID ${id} and event type of ${eventType}`)
//   console.log('Webhook payload:', body)

if(evt.type === 'user.created'){
    const {id, email_addresses, first_name, image_url} = evt.data
    try {
       const newUser = await db.user.create({
        data: {
          clerkUserId : id,
          email : email_addresses[0].email_address,
          name: first_name,
          imageUrl : image_url
        }
       })
       return new Response(JSON.stringify(newUser), {
        status: 200,
       })
    } catch (error) {
      console.log('Error: Failed to store user in the database', error)
      return new Response('Error: Failed to store user in the database', {
        status: 500,
      })
        
    }
}

if(evt.type === 'user.updated') {
  const { id, email_addresses, first_name, image_url } = evt.data

  // Fetch the existing user
  const existingUser = await db.user.findUnique({
    where: {
      clerkUserId: id
    }
  })

  // Prevent unnecessary updates
  if(!existingUser) {
    return new Response('Error: User not found in the database');
  }
  if (
    existingUser.email === email_addresses[0].email_address &&
    existingUser.name === first_name &&
    existingUser.imageUrl === image_url
  ) {
    console.log('No changes detected. Skipping update.')
    return new Response('No changes detected', { status: 200 })
  }

  // Update user only if changes are detected
  try {
    const updatedUser = await db.user.update({
      where: {
        clerkUserId: id
      },
      data: {
        email: email_addresses?.[0]?.email_address ?? undefined,
        name: first_name ?? undefined,
        imageUrl: image_url ?? undefined
      }
    })
    return new Response(JSON.stringify(updatedUser), { status: 200 })
  } catch (error) {
    console.log('Error: Failed to update user in the database', error)
    return new Response('Error: Failed to update user in the database', {
      status: 500,
    })
  }
}

if (evt.type === 'user.deleted') {
  try {
    // Always check if data and ID exist
    const userId = evt.data?.id;
    
    if (!userId) {
      console.log('No user ID provided. Skipping deletion.');
      return new Response('User already deleted or no ID provided', { status: 200 });
    }

    const existingUser = await db.user.findUnique({
      where: {
        clerkUserId: userId
      }
    });

    // If no user exists, simply log and return
    if (!existingUser) {
      console.log(' User already deleted. Skipping...');
      return new Response('User already deleted', { status: 200 });
    }

    // Now delete the user from the database
    const deletedUser = await db.user.delete({
      where: {
        clerkUserId: userId
      }
    });
    return new Response(JSON.stringify(deletedUser), { status: 200 });
  } catch (error) {
    console.log('Failed to delete user in the database', error);
    return new Response('Failed to delete user in the database', { status: 500 });
  }
}

  return new Response('Webhook received', { status: 200 })
}