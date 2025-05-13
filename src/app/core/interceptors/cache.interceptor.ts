import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap, shareReplay } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root' // Garante que seja um singleton em toda a aplicação
})
export class CacheInterceptor implements HttpInterceptor {
  private cache = new Map<string, {response: HttpResponse<unknown>, timestamp: number}>();
  private readonly CACHE_LIFETIME = 5 * 60 * 1000; // 5 minutos em milissegundos
  private appVersion = Date.now().toString(); // Identificador de versão baseado em timestamp
  
  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Não fazer cache no lado do servidor
    if (!isPlatformBrowser(this.platformId)) {
      return next.handle(req);
    }
    
    // Somente métodos GET são cacheados
    if (req.method !== 'GET') {
      return next.handle(req);
    }

    // Não cachear solicitações que têm um cabeçalho 'no-cache'
    if (req.headers.has('no-cache')) {
      return next.handle(req);
    }

    // Não cachear recursos de navegação críticos (HTML, JS, CSS)
    const url = req.url.toLowerCase();
    if (url.endsWith('.html') || url.endsWith('.js') || url.endsWith('.css')) {
      // Adiciona um cabeçalho de versão para forçar atualização de recursos
      const versionedReq = req.clone({
        setHeaders: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'X-App-Version': this.appVersion
        }
      });
      return next.handle(versionedReq);
    }

    // Chave de cache com versão para diferenciar entre deployments
    const cacheKey = req.urlWithParams;
    const cachedData = this.cache.get(cacheKey);
    const now = Date.now();

    // Verifica se há uma resposta em cache válida (não expirada)
    if (cachedData && (now - cachedData.timestamp < this.CACHE_LIFETIME)) {
      return of(cachedData.response.clone());
    }

    // Remove item expirado do cache
    if (cachedData) {
      this.cache.delete(cacheKey);
    }

    // Processa a solicitação e a armazena em cache
    return next.handle(req).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          this.cache.set(cacheKey, {
            response: event.clone(),
            timestamp: Date.now()
          });
        }
      }),
      shareReplay(1) // Garantir que múltiplos assinantes compartilhem a mesma resposta
    );
  }

  // Método para limpar o cache manualmente se necessário
  clearCache(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.cache.clear();
    }
  }
  
  // Método para atualizar a versão do app (útil após implantações)
  updateVersion(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.appVersion = Date.now().toString();
      this.clearCache();
    }
  }
} 