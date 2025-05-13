import { Component, HostListener, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header.component';
import { CacheInterceptor } from './core/interceptors/cache.interceptor';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'portifolio';
  
  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private cacheInterceptor: CacheInterceptor
  ) {}
  
  ngOnInit(): void {
    // Verificar se estamos no navegador (client-side) antes de manipular caches
    if (isPlatformBrowser(this.platformId)) {
      // Pequeno atraso para permitir que a hidratação seja concluída
      setTimeout(() => {
        // Verifica se a aplicação foi atualizada
        this.checkForAppUpdate();
        
        // Adiciona um evento para limpar o cache quando a aplicação voltar ao foco
        window.addEventListener('focus', () => {
          this.cacheInterceptor.clearCache();
        });
      }, 100);
    }
  }
  
  private checkForAppUpdate(): void {
    try {
      const lastVisit = localStorage.getItem('lastVisit');
      const currentVisit = Date.now().toString();
      
      // Se não houver registro de última visita ou se passaram mais de 30 minutos
      if (!lastVisit || (Date.now() - parseInt(lastVisit, 10)) > 30 * 60 * 1000) {
        console.log('Limpando cache da aplicação...');
        // Força atualização da versão
        this.cacheInterceptor.updateVersion();
        
        // Tenta limpar os caches do navegador (se disponível)
        this.clearBrowserCaches();
      }
      
      // Atualiza timestamp da última visita
      localStorage.setItem('lastVisit', currentVisit);
    } catch (error) {
      console.error('Erro ao verificar atualização da aplicação:', error);
    }
  }
  
  private clearBrowserCaches(): void {
    try {
      // Tenta limpar o cache do service worker (se existir)
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(registrations => {
          for (const registration of registrations) {
            registration.unregister();
          }
        }).catch(err => console.error('Erro ao desregistrar service workers:', err));
      }
      
      // Tenta limpar os caches da API Cache (se disponível)
      if ('caches' in window) {
        caches.keys().then(keyList => {
          return Promise.all(keyList.map(key => {
            return caches.delete(key);
          }));
        }).catch(err => console.error('Erro ao limpar caches:', err));
      }
      
      // Força recarregamento sem cache se o usuário pressionar F5 ou recarregar manualmente
      window.addEventListener('beforeunload', () => {
        localStorage.setItem('forceReload', 'true');
      });
      
      if (localStorage.getItem('forceReload') === 'true') {
        localStorage.removeItem('forceReload');
        window.location.reload();
      }
    } catch (error) {
      console.error('Erro ao limpar caches do navegador:', error);
    }
  }
  
  // Ouvir eventos de rolagem para adicionar a classe de rolagem à visualização
  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (isPlatformBrowser(this.platformId)) {
      // Implementação de manipulação de rolagem se necessário
    }
  }
  
  // Ouvir mudanças no hash da URL
  @HostListener('window:hashchange', [])
  onHashChange() {
    if (isPlatformBrowser(this.platformId)) {
      // Implementação para lidar com mudanças de hash se necessário
    }
  }
}
