import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

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

        // Első aktiválás - HWID mentése
        if (!keyDoc.hwid) {
            const { error: updateError } = await supabase
                .from('keys')
                .update({ hwid: hwid })
                .eq('id', keyDoc.id);

            if (updateError) {
                return NextResponse.json(
                    { valid: false, message: 'Activation failed!' },
                    { status: 500 }
                );
            }

            return NextResponse.json(
                { valid: true, message: 'First activation successful!' },
                { status: 200 }
            );
        }

        // HWID ellenőrzés
        if (keyDoc.hwid !== hwid) {
            return NextResponse.json(
                { valid: false, message: 'This key is activated on another machine!' },
                { status: 200 }
            );
        }

        return NextResponse.json(
            { valid: true, message: 'Key accepted!' },
            { status: 200 }
        );

    } catch (error) {
        console.error('Hiba:', error);
        return NextResponse.json(
            { valid: false, message: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}