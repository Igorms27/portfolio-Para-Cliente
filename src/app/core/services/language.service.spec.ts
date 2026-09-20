import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { LanguageService } from './language.service';

describe('LanguageService', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        LanguageService,
        { provide: PLATFORM_ID, useValue: 'browser' },
      ],
    });
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('uses English as the default language', () => {
    const service = TestBed.inject(LanguageService);

    expect(service.getCurrentLanguage()).toBe('en');
  });

  it('persists a supported language change', () => {
    const service = TestBed.inject(LanguageService);

    service.changeLanguage('pt');

    expect(service.getCurrentLanguage()).toBe('pt');
    expect(localStorage.getItem('language')).toBe('pt');
  });

  it('ignores unsupported languages', () => {
    const service = TestBed.inject(LanguageService);

    service.changeLanguage('es');

    expect(service.getCurrentLanguage()).toBe('en');
    expect(localStorage.getItem('language')).toBeNull();
  });
});
