'use client';
import { useSearchParams } from 'next/navigation';

export default function Link() {
    const searchParams = useSearchParams();
    console.log(searchParams.get('id') ,"<<<<<<<<<<<<<<<<<<<<<<<<");
    
    const id = searchParams.get('id'); 
    return(
        <></>
    )
}