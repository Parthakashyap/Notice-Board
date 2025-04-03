import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Notice from '@/models/Notice';

// Define the Notice type
type Notice = {
  id: string;
  title: string;
  content: string;
  position?: number;
};

const ADMIN_KEY = "IIC_rgu%#19"; // Hard-coded admin key

export async function GET() {
  try {
    await connectDB();
    const notices = await Notice.find({}).sort({ id: 1 });
    return NextResponse.json(notices);
  } catch (error) {
    console.error('Error fetching notices:', error);
    return NextResponse.json({ error: 'Failed to fetch notices' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const { updatedNotice, adminKey }: { updatedNotice: any; adminKey: string } = data;

    // Verify admin key
    if (adminKey !== ADMIN_KEY) {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
    }

    await connectDB();
    
    // Find and update the notice with matching ID
    const notice = await Notice.findOneAndUpdate(
      { id: updatedNotice.id },
      { 
        $set: {
          position: updatedNotice.position,
          color1: updatedNotice.color1,
          color2: updatedNotice.color2,
          text: updatedNotice.text,
          image: updatedNotice.image
        }
      },
      { new: true }
    );

    if (!notice) {
      return NextResponse.json({ error: 'Notice not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, notice });
  } catch (error) {
    console.error('Error updating notice:', error);
    return NextResponse.json({ error: 'Failed to update notice' }, { status: 500 });
  }
}
