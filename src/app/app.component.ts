import { Component, effect, ElementRef, viewChild } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';


declare var confetti: any;

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms ease-in', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class AppComponent {


  bgMusic = viewChild<ElementRef<HTMLAudioElement>>('bgMusic');
  click = viewChild<ElementRef<HTMLAudioElement>>('bgClick');
  error = viewChild<ElementRef<HTMLAudioElement>>('bgError');

  quizStarted = false;
  currentQuestionIndex = 0;
  showCelebration = false;
  questions = [
    { question: "Where did Lolo wear a Saree for the first time on a date with Popo?", options: ["Broadway", "Chowman", "Oudh 1590"] },
    { question: "What was Popo and Lolo's first date like at the Ghats?", options: ["Magical ✨", "Cute & Awkward 😆", "The best day ever 💖", "Relaxing 😌"] },
    { question: "What’s Popo's favorite thing about Lolo?", options: ["The way Lolo shruggs Popo off when she is angry 💕", "Lolo's smile 😊", "The way Lolo becomes a baby 🥰"] },
    { question: "What was the funniest thing that happened when Popo's parents came to know about Lolo?", options: ["The way Popo embarrassed himself 😂", "Popo's excuses to his parents 🤣", "Popo's parents reactions 😜"] },
    { question: "Which of Popo's nicknames for Lolo is hes favorite?", options: ["Smarty Pants 🥰", "Tuturi 😘", "Lolo 💖"] },
    { question: "What song reminds Lolo of Popo?", options: ["Ekta Chele by Sahana 🎶", "Kotha Koiyo Na (Coke Studio Bangla) ❤️", "Apna Bana Le from Bhediya 💑"] },
    { question: "If Popo had to surprise Lolo with food, what would make Lolo the happiest?", options: ["Lolo's favorites like momo 🥟, cake 🍰, chocolate 🍫", "A romantic date at any fancy restaurant 🍽️", "Breakfast in bed 😍", "A dinner date at home 🏠"] },
    { question: "How does Lolo feels when Popo and Lolo hug?", options: ["Safe & happy 🤗", "Like she never want to let go 💞", "Butterflies every time 🦋"] },
    { question: "Which moment with Popo made Lolo's heart skip a beat?", options: ["When Popo proposed Lolo at the ghat 💖", "When Popo proposed Lolo at Goa ✨", "When Popo danced for Lolo at their engagement 💑"] }
  ];
  showDarkOverlay: boolean = false;
  typingText: string = "";
  shakeButton: boolean = false;
  requestTexts = [
    { text: "Oops! I think you pressed the wrong button. Try again. 😉", used: false },
    { text: "Hmm… Seems like there’s a glitch. Let’s fix that with a YES!", used: false },
    { text: "Let me ask in a different way... If I give you chocolates 🍫, will you say yes?", used: false },
    { text: "What if I get on one knee? Just imagine… now say YES!", used: false },
    { text: "Think of all the fun we’ll have. You sure you want to say no? Try again!", used: false },
    { text: "I’ll keep asking until you give the right answer. ❤️", used: false },
    { text: "You wouldn’t break my heart… right? Give it one more shot. 😘", used: false },
    { text: "You do know there’s only one way out of this, right? A big YES!", used: false },
    { text: "Saying no isn't allowed in this game… Let's try again!", used: false }
  ];
  isTyping: boolean = false;

  showSurpriseMessage = false;

  constructor() { 
    effect(() => {
      if (this.bgMusic()) {
        this.bgMusic()!.nativeElement.volume = 0.3;
        this.bgMusic()!.nativeElement.play().catch(error => {
          console.log("Auto-play blocked, waiting for user interaction.");
        });
      }
      if (this.click()) {
        this.click()!.nativeElement.volume = 0.5;
      }
      if (this.error()) {
        this.error()!.nativeElement.volume = 0.5;
      }
    });
  }


  startQuiz() {
    this.playClick();
    this.quizStarted = true;
    this.playApnaBanaLe();
  }

  nextQuestion() {
    this.playClick();
    this.currentQuestionIndex++;
    if (this.currentQuestionIndex === this.questions.length) {
      this.playTomarPichu();
    }
  }

  askAgain() {
    this.playError();
    const selectedText = this.getRequestText(); // Get a random request text
    
    this.typingText = ""; // Clear previous text
    this.showDarkOverlay = true; // Darken background
    this.shakeButton = true; // Trigger shake animation
    
    setTimeout(() => {
      this.shakeButton = false; // Stop shaking after animation
    }, 1000);
  
    // Simulate typing effect
    this.isTyping = true;
    let charIndex = 0;
    const chars = Array.from(selectedText); // Converts string into an array of characters, handling emojis properly
    const typingInterval = setInterval(() => {
      if (charIndex < chars.length) {
        this.typingText += chars[charIndex];
        charIndex++;
      } else {
        clearInterval(typingInterval); // Stop typing effect when done
        this.showDarkOverlay = false; // Remove dark effect
        this.isTyping = false; // Done typing
      }
    }, 50); // Typing speed (50ms per character)
  
  }

  getRequestText(): string {
    const unusedTexts = this.requestTexts.filter(text => !text.used);

    if (unusedTexts.length === 0) {
      this.requestTexts.forEach(text => text.used = false);
      return this.getRequestText();
    }

    const randomIndex = Math.floor(Math.random() * unusedTexts.length);
    const selectedText = unusedTexts[randomIndex];
    selectedText.used = true;

    return selectedText.text;
  }

  showSuccess(event: MouseEvent) {
    this.showCelebration = true;
    this.playAmarKache();
    this.launchConfetti(event);
  }

  playApnaBanaLe() {
    if (this.bgMusic()) {
      this.bgMusic()!.nativeElement.pause(); // Stop background music
      this.bgMusic()!.nativeElement.src = "music/audio-2.mp3"; // Load a new song
      this.bgMusic()!.nativeElement.play(); // Play the romantic song
    }
  }

  playTomarPichu() {
    if (this.bgMusic()) {
      this.bgMusic()!.nativeElement.pause(); // Stop background music
      this.bgMusic()!.nativeElement.src = "music/audio-3.mp3"; // Load a new song
      this.bgMusic()!.nativeElement.play(); // Play the romantic song
    }
  }

  playAmarKache() {
    if (this.bgMusic()) {
      this.bgMusic()!.nativeElement.pause(); // Stop background music
      this.bgMusic()!.nativeElement.src = "music/audio-4.mp3"; // Load a new song
      this.bgMusic()!.nativeElement.play(); // Play the romantic song
    }
  }

  playNewHome() {
    if (this.bgMusic()) {
      this.bgMusic()!.nativeElement.pause(); // Stop background music
      this.bgMusic()!.nativeElement.src = "music/audio-5.mp3"; // Load a new song
      this.bgMusic()!.nativeElement.play(); // Play the romantic song
    }
  }

  playClick() {
    if (this.click()) {
      this.click()!.nativeElement.play().catch(error => {
        console.log("Auto-play blocked, waiting for user interaction.");
      });
    }
  }

  playError() {
    if (this.error()) {
      this.error()!.nativeElement.play().catch(error => {
        console.log("Auto-play blocked, waiting for user interaction.");
      });
    }
  }

  showSpecialMessage() {
    this.showSurpriseMessage = true;
    this.playNewHome();
  }

  // Confetti Animation
  launchConfetti(event: MouseEvent) {

    const x = event.clientX / window.innerWidth;
    const y = event.clientY / window.innerHeight;

    const duration = 5000; // Confetti for 5 seconds
    const animationEnd = Date.now() + duration;
    const colors = ["#ff4081", "#ff80ab", "#e91e63", "#f50057"]; // Pink & romantic colors
  
    const interval = setInterval(() => {
      if (Date.now() > animationEnd) {
        clearInterval(interval);
      } else {
        confetti({
          particleCount: 100,
          spread: 70,
          colors: colors,
          // origin: { x, y }
          origin: { x: Math.random(), y: Math.random() - 0.2 }, // Random confetti burst
        });
      }
    }, 300);
  }

}
