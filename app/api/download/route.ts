import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
);

export async function POST(request: Request) {
    try {
        const { key, hwid } = await request.json();
        
        if (!key) {
            return NextResponse.json(
                { valid: false, message: 'Missing key!' },
                { status: 400 }
            );
        }

        // Kulcs keresése
        const { data: keyDoc, error } = await supabase
            .from('keys')
            .select('*')
            .eq('key', key.trim())
            .eq('active', true)
            .single();

        if (error || !keyDoc) {
            return NextResponse.json(
                { valid: false, message: 'Invalid key!' },
                { status: 200 }
            );
        }

        // Download link - place your GitHub Releases download link here
        const downloadUrl = "https://github.com/godspeed7733/WindowsFormsApp1/releases/latest/ethav2.exe";

        return NextResponse.json({ valid: true, downloadUrl }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ valid: false, message: 'Server error!' }, { status: 500 });
    }
}