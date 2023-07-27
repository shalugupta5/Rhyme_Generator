
import Swal from 'sweetalert2';
import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

interface PromptOption {
  name: string;
  value: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'shayari-generator';
  prompt: string = '';
  generatedShayari: string = '';
  selectedPrompt!: string;
  isLoading: boolean = false;
  promptOptions: PromptOption[] = [
    { name: 'Love', value: 'You are my love' },
    { name: 'Nature', value: 'In the midst of nature' },
    { name: 'Friendship', value: 'Friends forever' }
  ];

  constructor(private http: HttpClient) {}

  generateShayari() {
    this.isLoading = true;
    this.generatedShayari = '';

    Swal.fire({
      title: 'Generating Shayari',
      text: 'Please wait...',
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    const prompt = this.selectedPrompt === 'other' ? this.prompt : this.selectedPrompt;

    const apiUrl = 'https://api.openai.com/v1/chat/completions';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer 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' // Replace with your OpenAI API key
    });

    const data = {
      "model": "gpt-3.5-turbo",
      messages: [
        { role: 'system', content: 'You are a rhymer and generate rhymes according to the given prompt' },
        { role: 'user', content: prompt }
      ]
    };

    this.http.post<any>(apiUrl, data, { headers }).subscribe(response => {
      this.handleShayariGeneration(response.choices);
      this.isLoading = false; // Stop loading
      Swal.close();
    }, error => {
      console.error('Error generating Shayari:', error);
      this.isLoading = false; // Stop loading
      Swal.close();
    });
  }

  handleShayariGeneration(choices: any[]): void {
    const delay = 0; // Delay between each line (in milliseconds)
    let currentIndex = 0;
    let lineCount = 0; // Counter for the shayari lines

    const intervalId = setInterval(() => {
      if (currentIndex >= choices.length || lineCount >= 5) {
        clearInterval(intervalId);
        this.playMusic(); // Play the music after loading the shayari
        return;
      }

      const message = choices[currentIndex].message;
      if (message.role === 'system') {
        // Ignore system messages
        currentIndex++;
        return;
      }

      const content = message.content.trim();
      if (content !== '') {
        this.generatedShayari += content + '\n';
        lineCount++;
        this.speak(content);
      }

      currentIndex++;
    }, delay);
  }

  playMusic(): void {
    const audio = new Audio('assets/meditative-background-music-for-short-vlog-videos-30-seconds-155717.mp3'); // Replace with the correct path to your music file
    audio.volume = 0.05; // Set the volume to 30% (adjust as desired)
    audio.play();
  }
  

  speak(text: string) {
    const utterance = new SpeechSynthesisUtterance(text);

    // Detect the language of the text
    const hindiPattern = /[\u0900-\u097F]/;
    const isHindi = hindiPattern.test(text);

    // Set the speech synthesis language based on the detected language
    utterance.lang = isHindi ? 'hi-IN' : 'en-US';

    speechSynthesis.speak(utterance);
  }

  testSound() {
    const utterance = new SpeechSynthesisUtterance('Testing sound');
    utterance.lang = 'en-US';
    speechSynthesis.speak(utterance);
  }
}
