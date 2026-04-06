#!/bin/bash
# Guardian chat demo — simulated conversations showing life-aware AI
# Usage: ./chat-demo.sh [1|2|3|4|5]

RESET="\033[0m"
BOLD="\033[1m"
DIM="\033[2m"
ITALIC="\033[3m"
CYAN="\033[36m"
GREEN="\033[32m"
YELLOW="\033[33m"
WHITE="\033[37m"
GRAY="\033[90m"

type_text() {
  local text="$1"
  local delay="${2:-0.02}"
  for ((i=0; i<${#text}; i++)); do
    printf "%s" "${text:$i:1}"
    sleep "$delay"
  done
  echo
}

print_user() {
  echo
  printf "${BOLD}${CYAN}you${RESET}${GRAY}  %s${RESET}\n" "$2"
  type_text "$1" 0.015
}

print_guardian() {
  echo
  printf "${BOLD}${GREEN}guardian${RESET}${GRAY}  %s${RESET}\n" "$2"
  sleep 0.3
  type_text "$1" 0.008
}

print_evidence() {
  printf "${DIM}${GRAY}  ╰─ %s${RESET}\n" "$1"
}

print_header() {
  clear
  echo
  printf "${BOLD}${WHITE}  ◉ Guardian${RESET}${GRAY}  —  $1${RESET}\n"
  printf "${GRAY}  ─────────────────────────────────────────────────────${RESET}\n"
}

# Demo 1: Recall across contexts
demo_recall() {
  print_header "Recall"

  print_user "who did i talk to about hiring this week?"

  print_guardian "You brought up the hiring problem in three separate conversations:"
  echo
  print_evidence "Mon 3:14 PM — call with Marcus, you said the pipeline is dry"
  print_evidence "Wed 11:30 AM — coffee with Sarah, she suggested reaching out to her ex-CTO"
  print_evidence "Thu 9:00 PM — told Lindsay you're stuck on the first engineering hire"
  echo
  print_guardian "None of them heard each other's suggestions. Sarah's CTO referral is the only concrete lead. You haven't followed up on it."

  echo
}

# Demo 2: Pattern detection
demo_patterns() {
  print_header "Pattern detection"

  print_user "what have i been avoiding?"

  sleep 0.5
  print_guardian "Based on the last two weeks:"
  echo
  type_text "  1. The firmware timeline conversation with the hardware team." 0.008
  print_evidence "You cut the deadline by two weeks on Mar 19. The team still has the old date."
  echo
  type_text "  2. Replying to the Lux Capital intro." 0.008
  print_evidence "Sarah sent the intro email on Mar 20. You opened it twice but didn't respond."
  echo
  type_text "  3. Booking the dentist appointment you mentioned on Mar 14, Mar 17, and Mar 21." 0.008
  print_evidence "Three separate mentions across recorder audio. No calendar event created."
  echo
  print_guardian "The firmware one has the highest downstream risk. The dentist is the easiest win."

  echo
}

# Demo 3: Proactive morning briefing
demo_briefing() {
  print_header "Morning briefing  ·  Saturday, March 22"

  print_guardian "Good morning. Here's what matters today."
  echo
  type_text "  No meetings on your calendar." 0.008
  type_text "  You told Paul yesterday you'd \"lock in for a couple days.\"" 0.008
  print_evidence "Thu 5:01 PM — wearable audio, downtown San Jose"
  echo
  type_text "  Sarah's investor intro is still unanswered (2 days)." 0.008
  type_text "  You have 25 untranscribed recorder files from this week." 0.008
  echo
  print_guardian "If you're taking the day off, the only time-sensitive thing is the intro email. Everything else can wait until Monday."

  echo
}

# Demo 4: Cross-context connection
demo_connections() {
  print_header "Cross-context"

  print_user "what was that thing grant said about archiving?"

  sleep 0.4
  print_guardian "You didn't discuss archiving with Grant directly. But during the conversation after visiting him, you referenced a Microsoft engineer who archived everything."
  print_evidence "Sat 3:00 PM — wearable audio, San Francisco"
  echo
  print_guardian "You were describing Gordon Bell's MyLifeBits project as a precursor to Guardian. Your companion recognized it: \"Do you know life insights? Yeah, actually.\""
  echo
  print_guardian "Related: you described the same idea to Lindsay later that night as \"an AI that sees your entire life and tells you something.\""
  print_evidence "Sat 9:30 PM — GoPro + recorder, Hayes Valley"

  echo
}

# Demo 5: Real-time awareness
demo_realtime() {
  print_header "Real-time"

  print_guardian "You've been in deep focus for 4 hours. A few things:"
  echo
  type_text "  1. You have a call with Keoni in 35 minutes." 0.008
  print_evidence "Google Calendar — 4:00 PM"
  echo
  type_text "  2. Paul messaged you twice on Signal. Looks like it's about the upload app." 0.008
  print_evidence "Desktop capture — Signal notification at 3:12 PM and 3:18 PM"
  echo
  type_text "  3. You said yesterday you'd send the deck to Arya \"first thing tomorrow.\"" 0.008
  print_evidence "Thu 5:34 PM — wearable audio"
  echo
  print_guardian "The Keoni call is the hard deadline. The deck to Arya is a soft promise you'll want to keep."

  echo
}

# Main
case "${1:-all}" in
  1|recall) demo_recall ;;
  2|patterns) demo_patterns ;;
  3|briefing) demo_briefing ;;
  4|connections) demo_connections ;;
  5|realtime) demo_realtime ;;
  all)
    demo_recall
    echo -e "${GRAY}  ─────────────────────────────────────────────────────${RESET}"
    read -p "  Press enter for next demo..." -s
    demo_patterns
    echo -e "${GRAY}  ─────────────────────────────────────────────────────${RESET}"
    read -p "  Press enter for next demo..." -s
    demo_briefing
    echo -e "${GRAY}  ─────────────────────────────────────────────────────${RESET}"
    read -p "  Press enter for next demo..." -s
    demo_connections
    echo -e "${GRAY}  ─────────────────────────────────────────────────────${RESET}"
    read -p "  Press enter for next demo..." -s
    demo_realtime
    ;;
  *) echo "Usage: $0 [1|2|3|4|5|all]" ;;
esac

echo
printf "${GRAY}  All evidence sourced from Guardian pipeline · guardian_memory.db${RESET}\n"
echo
