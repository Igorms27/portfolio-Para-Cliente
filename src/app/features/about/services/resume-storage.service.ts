import { Injectable } from '@angular/core';
import { StorageService } from '../../../core/services/storage.service';
import { Observable, of, catchError, tap, from, throwError } from 'rxjs';
import { Storage, ref, getDownloadURL } from '@angular/fire/storage';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ResumeStorageService {
  private readonly RESUME_PATH = 'resumes';
  private readonly RESUME_NAME = 'curriculo_israel_oliveira.pdf';
  private resumeUrl: string | null = null;
  
  // Para compatibilidade entre os dois projetos Firebase
  private readonly FIREBASE_BUCKET = environment.firebase.storageBucket;
  private readonly FIREBASE_BUCKET_ALT = 'portifolio-32b68.firebasestorage.app';

  constructor(
    private storageService: StorageService,
    private storage: Storage
  ) { }

  /**
   * Obtém a URL do currículo do Firebase Storage
   * @returns Observable com a URL do currículo
   */
  getResumeUrl(): Observable<string> {
    // Se já tivermos a URL em cache, retorna ela
    if (this.resumeUrl) {
      return of(this.resumeUrl);
    }
    
    // Tentar obter a URL do Firebase configurado na aplicação
    return this.fetchResumeUrl().pipe(
      catchError(error => {
        // Se falhar com o primeiro projeto, tenta com o segundo projeto
        if (error.code === 'storage/unauthorized' || error.code === 'storage/object-not-found') {
          console.warn('Tentando buscar o currículo no projeto Firebase alternativo...');
          return this.fetchResumeUrlFromAlt().pipe(
            catchError(altError => {
              console.error('Não foi possível obter o currículo de nenhum dos projetos Firebase:', altError);
              return throwError(() => new Error('Currículo não disponível. Por favor, tente novamente mais tarde.'));
            })
          );
        }
        
        console.error('Erro ao obter URL do currículo do Firebase:', error);
        return throwError(() => new Error('Erro ao carregar o currículo. Por favor, tente novamente mais tarde.'));
      }),
      tap(url => {
        // Armazena em cache para futuras requisições
        this.resumeUrl = url;
      })
    );
  }

  /**
   * Método privado para buscar a URL do currículo no Firebase Storage principal
   */
  private fetchResumeUrl(): Observable<string> {
    const resumeRef = ref(this.storage, `${this.RESUME_PATH}/${this.RESUME_NAME}`);
    return from(getDownloadURL(resumeRef)).pipe(
      catchError(error => {
        console.error('Erro ao obter URL do Storage principal:', error);
        throw error;
      })
    );
  }
  
  /**
   * Método privado para buscar a URL do currículo no Firebase Storage alternativo
   */
  private fetchResumeUrlFromAlt(): Observable<string> {
    // Como não temos acesso direto ao projeto alternativo via Storage do Angular Fire,
    // vamos construir a URL manualmente usando o padrão do Firebase Storage
    const url = `https://firebasestorage.googleapis.com/v0/b/${this.FIREBASE_BUCKET_ALT}/o/${this.RESUME_PATH}%2F${this.RESUME_NAME}?alt=media`;
    
    // Verificar se a URL é válida tentando fazer um fetch
    return from(fetch(url).then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return url;
    })).pipe(
      catchError(error => {
        console.error('Erro ao verificar URL alternativa:', error);
        throw error;
      })
    );
  }

  /**
   * Faz o upload do currículo para o Firebase Storage
   * @param file Arquivo do currículo
   * @returns Observable com a URL de download
   */
  uploadResume(file: File): Observable<string> {
    // Se o arquivo não for um PDF, retorna erro
    if (!file.type.includes('pdf')) {
      return throwError(() => new Error('O arquivo deve ser um PDF'));
    }

    // Renomear o arquivo para um nome fixo
    const renamedFile = new File([file], this.RESUME_NAME, { type: file.type });

    // Upload para o Firebase Storage
    return this.storageService.uploadFile(renamedFile, this.RESUME_PATH).pipe(
      tap(url => {
        // Armazena em cache para futuras requisições
        this.resumeUrl = url;
      }),
      catchError(error => {
        console.error('Erro ao fazer upload do currículo:', error);
        return throwError(() => new Error('Falha ao enviar o currículo'));
      })
    );
  }
} 