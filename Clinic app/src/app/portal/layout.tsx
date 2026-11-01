import { PortalShell } from "@/components/doctor-portal/portal-shell";

export default function DoctorPortalLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <PortalShell>{children}</PortalShell>;
}
