import { NextResponse } from 'next/server';
import { upsertUserProfile, getUserProfile } from '@/lib/db';

export async function POST(request) {
  try {
    const { userId, userData } = await request.json();
    
    if (!userId || !userData) {
      return NextResponse.json(
        { success: false, message: 'User ID and user data are required' },
        { status: 400 }
      );
    }

    const result = await upsertUserProfile(userId, userData);
    
    return NextResponse.json({
      success: true,
      message: 'User profile updated successfully',
      result
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update user profile', error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID is required' },
        { status: 400 }
      );
    }

    const userProfile = await getUserProfile(userId);
    
    if (!userProfile) {
      return NextResponse.json(
        { success: false, message: 'User profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      userProfile
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch user profile', error: error.message },
      { status: 500 }
    );
  }
}

