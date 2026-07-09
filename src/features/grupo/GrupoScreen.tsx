import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Card } from '@/components/ui/Card';

interface Member {
  name: string;
  rm: string;
  bg: string;
}

const MEMBERS: Member[] = [
  { name: 'Dario Lacerda', rm: 'rm369195', bg: 'bg-blue-200' },
  { name: 'Larissa Kramer', rm: 'rm370062', bg: 'bg-rose-200' },
  { name: 'Mirian Storino', rm: 'rm369489', bg: 'bg-violet-200' },
  { name: 'Natanael Dias', rm: 'rm369334', bg: 'bg-amber-200' },
  { name: 'Tiago Victor', rm: 'rm370117', bg: 'bg-emerald-200' },
];

function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function GrupoScreen() {
  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-4 gap-4">
        <Text className="text-base text-muted">
          Turma 8FSDT — Pós Tech FIAP. Tech Challenge Fase 4.
        </Text>

        <View className="gap-3">
          {MEMBERS.map((m) => (
            <Card key={m.rm}>
              <View className="flex-row items-center gap-3">
                <View
                  className={`h-12 w-12 items-center justify-center rounded-full ${m.bg}`}
                >
                  <Text className="text-base font-semibold text-foreground">
                    {initials(m.name)}
                  </Text>
                </View>
                <View>
                  <Text className="text-base font-semibold text-foreground">
                    {m.name}
                  </Text>
                  <Text className="font-mono text-xs text-muted">{m.rm}</Text>
                </View>
              </View>
            </Card>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
