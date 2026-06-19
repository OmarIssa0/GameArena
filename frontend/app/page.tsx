import { SocialPanel } from "@/component/social_media";
import { Sidebar } from "lucide-react";
import { redirect } from "next/navigation";
import api from "./network";

export default function Home() {
  redirect("/home");
}
