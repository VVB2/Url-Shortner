import { ModeToggle } from "@/components/ui/dark-mode-toggle"
import { DialogueBox } from "@/components/ui/url-shortner-dialogue"

export default async function Home() {
    return (
        <div>
            <ModeToggle />
            <DialogueBox />
        </div>
    )
}
