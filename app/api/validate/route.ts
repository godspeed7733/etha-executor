import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Key from '@/lib/models/key';

export async function POST(request: Request) {
    console.log('MONGODB_URI:', process.env.MONGODB_URI);
    try {
        await connectDB();
        const { key, hwid } = await request.json();

        console.log('Beérkező kulcs:', key);
        console.log('Beérkező kulcs hossza:', key.length);

        if (!key) {
            return NextResponse.json({ valid: false, message: 'Missing key!' }, { status: 400 });
        }

        const allKeys = await Key.find({});
        console.log('Összes kulcs:', allKeys.map(k => k.key));

        const keyDoc = await Key.findOne({ key: key.trim(), active: true });
        console.log('Talált dokumentum:', keyDoc);

        if (!keyDoc) {
            return NextResponse.json({ valid: false, message: 'Invalid key!' }, { status: 200 });
        }

        if (!keyDoc.hwid) {
            keyDoc.hwid = hwid;
            await keyDoc.save();
            return NextResponse.json({ valid: true, message: 'First activation successful!' }, { status: 200 });
        }

        if (keyDoc.hwid !== hwid) {
            return NextResponse.json({ valid: false, message: 'This key is activated on another machine!' }, { status: 200 });
        }

        return NextResponse.json({ valid: true, message: 'Key accepted!' }, { status: 200 });

    } catch (error) {
        console.error('Részletes hiba:', error);
        return NextResponse.json({ 
            valid: false, 
            message: error instanceof Error ? error.message : String(error)
        }, { status: 500 });  
}

}
