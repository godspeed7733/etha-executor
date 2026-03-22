import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Key from '@/lib/models/key';

export async function POST(request: Request) {
    try {
        await connectDB();
        const { key } = await request.json();

        if (!key) {
            return NextResponse.json({ valid: false, message: 'Missing key!' }, { status: 400 });
        }

        const keyDoc = await Key.findOne({ key: key.toUpperCase(), active: true });

        if (!keyDoc) {
            return NextResponse.json({ valid: false, message: 'Invalid key!' }, { status: 200 });
        }

        // Download link - place your GitHub Releases download link here
        const downloadUrl = "https://github.com/godspeed7733/WindowsFormsApp1/releases/download/v2.1/Etha.executor.zip";

        return NextResponse.json({ valid: true, downloadUrl }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ valid: false, message: 'Server error!' }, { status: 500 });
    }
}