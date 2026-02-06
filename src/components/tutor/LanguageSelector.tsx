import { useState } from 'react';
import { Search, Globe, Check } from 'lucide-react';
import { SupportedLanguage, supportedLanguages } from '@/lib/studentMockData';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface LanguageSelectorProps {
  value: SupportedLanguage;
  onChange: (language: SupportedLanguage) => void;
}

export function LanguageSelector({ value, onChange }: LanguageSelectorProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  
  const selectedLanguage = supportedLanguages.find(l => l.code === value);
  
  const filteredLanguages = supportedLanguages.filter(lang => 
    lang.name.toLowerCase().includes(search.toLowerCase()) ||
    lang.nativeName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="w-[160px] justify-start gap-2">
          <Globe className="h-4 w-4" />
          <span>{selectedLanguage?.name || 'Language'}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[240px] p-2" align="start">
        <div className="relative mb-2">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search languages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-9"
          />
        </div>
        <div className="max-h-[200px] overflow-y-auto space-y-1">
          {filteredLanguages.map((lang) => (
            <button
              key={lang.code}
              className={cn(
                'w-full flex items-center justify-between px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors',
                value === lang.code && 'bg-primary/10 text-primary'
              )}
              onClick={() => {
                onChange(lang.code);
                setOpen(false);
                setSearch('');
              }}
            >
              <div className="flex flex-col items-start">
                <span className="font-medium">{lang.name}</span>
                <span className="text-xs text-muted-foreground">{lang.nativeName}</span>
              </div>
              {value === lang.code && <Check className="h-4 w-4" />}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
