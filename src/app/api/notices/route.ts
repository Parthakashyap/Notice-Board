import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Define the Notice type
type Notice = {
  id: string;
  title: string;
  content: string;
  position?: number;
};

const dataFilePath = path.join(process.cwd(), 'data', 'notices.json');
const ADMIN_KEY = "IIC_rgu%#19"; // Hard-coded admin key

export async function GET() {
  try {
    // Read the current notices from the JSON file
    const fileData = fs.readFileSync(dataFilePath, 'utf8');
    const notices: Notice[] = JSON.parse(fileData);
    return NextResponse.json(notices);
  } catch (error) {
    console.error('Error fetching notices:', error);
    return NextResponse.json({ error: 'Failed to fetch notices' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const { updatedNotice, adminKey }: { updatedNotice: Notice; adminKey: string } = data;

    // Verify admin key
    if (adminKey !== ADMIN_KEY) {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
    }

    // Read the current notices
    const fileData = fs.readFileSync(dataFilePath, 'utf8');
    const notices: Notice[] = JSON.parse(fileData);

    // Find and update the notice with matching ID
    const index = notices.findIndex((notice) => notice.id === updatedNotice.id);
    if (index !== -1) {
      // Keep the position property unchanged
      const position = notices[index].position;
      notices[index] = { ...updatedNotice, position };

      // Write the updated notices back to the file
      fs.writeFileSync(dataFilePath, JSON.stringify(notices, null, 2));

      return NextResponse.json({ success: true, notice: notices[index] });
    } else {
      return NextResponse.json({ error: 'Notice not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error updating notice:', error);
    return NextResponse.json({ error: 'Failed to update notice' }, { status: 500 });
  }
}
