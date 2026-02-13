import { SettingsLayout } from "@/widgets/settings";

export default function SettingsLayoutPage({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SettingsLayout>{children}</SettingsLayout>;
}
