"use client";
import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/img/logo.png";

export function Logo({ size = 36, className = "" }: { size?: number; className?: string }) {
  return (
    <Link href="/" className={`inline-flex items-center gap-2 ${className}`} data-testid="brand-logo">
      <Image
        src={logo}
        alt="Jobtake"
        width={size * 2.72}
        height={size}
        className="object-contain"
        priority
      />
    </Link>
  );
}