import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

const Index = () => {
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<'white' | 'black'>('white');

  // Initialize board with only pawns
  const initialBoard = {
    'a7': '♟', 'b7': '♟', 'c7': '♟', 'd7': '♟', 'e7': '♟', 'f7': '♟', 'g7': '♟', 'h7': '♟',
    'a2': '♙', 'b2': '♙', 'c2': '♙', 'd2': '♙', 'e2': '♙', 'f2': '♙', 'g2': '♙', 'h2': '♙'
  };

  const [board, setBoard] = useState(initialBoard);

  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

  // Check if move is valid (1 square in any direction)
  const isValidMove = (from: string, to: string) => {
    const fromFile = files.indexOf(from[0]);
    const fromRank = ranks.indexOf(from[1]);
    const toFile = files.indexOf(to[0]);
    const toRank = ranks.indexOf(to[1]);
    
    const fileDiff = Math.abs(toFile - fromFile);
    const rankDiff = Math.abs(toRank - fromRank);
    
    // Can move 1 square in any direction (including diagonally)
    return fileDiff <= 1 && rankDiff <= 1 && (fileDiff + rankDiff > 0);
  };

  const handleSquareClick = (square: string) => {
    if (selectedSquare) {
      // Check if move is valid
      if (board[selectedSquare] && isValidMove(selectedSquare, square)) {
        const newBoard = { ...board };
        newBoard[square] = board[selectedSquare];
        delete newBoard[selectedSquare];
        setBoard(newBoard);
        setCurrentPlayer(currentPlayer === 'white' ? 'black' : 'white');
      }
      setSelectedSquare(null);
    } else {
      // Only select if there's a piece and it belongs to current player
      if (board[square]) {
        const isWhitePiece = board[square] === '♙';
        const isBlackPiece = board[square] === '♟';
        if ((currentPlayer === 'white' && isWhitePiece) || (currentPlayer === 'black' && isBlackPiece)) {
          setSelectedSquare(square);
        }
      }
    }
  };

  const isSquareSelected = (square: string) => selectedSquare === square;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pixel-dark via-pixel-blue to-pixel-dark">
      {/* Header */}
      <header className="p-4 border-b-4 border-pixel-orange bg-pixel-dark/90">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-3xl font-pixel text-pixel-orange font-bold">
              PIXEL CHESS
            </div>
            <Badge className="bg-pixel-orange text-white font-pixel animate-pixel-glow">
              v1.0
            </Badge>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-white font-pixel">
              Ход: {currentPlayer === 'white' ? 'Белые' : 'Черные'}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-6">
        <Tabs defaultValue="game" className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-pixel-dark border-2 border-pixel-orange">
            <TabsTrigger value="game" className="font-pixel text-white data-[state=active]:bg-pixel-orange">
              <Icon name="GamepadIcon" size={16} className="mr-2" />
              Игра
            </TabsTrigger>
            <TabsTrigger value="profile" className="font-pixel text-white data-[state=active]:bg-pixel-orange">
              <Icon name="User" size={16} className="mr-2" />
              Профиль
            </TabsTrigger>
            <TabsTrigger value="rules" className="font-pixel text-white data-[state=active]:bg-pixel-orange">
              <Icon name="Book" size={16} className="mr-2" />
              Правила
            </TabsTrigger>
            <TabsTrigger value="menu" className="font-pixel text-white data-[state=active]:bg-pixel-orange">
              <Icon name="Menu" size={16} className="mr-2" />
              Меню
            </TabsTrigger>
            <TabsTrigger value="settings" className="font-pixel text-white data-[state=active]:bg-pixel-orange">
              <Icon name="Settings" size={16} className="mr-2" />
              Настройки
            </TabsTrigger>
          </TabsList>

          {/* Game Tab */}
          <TabsContent value="game" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Game Board */}
              <div className="lg:col-span-2">
                <Card className="bg-pixel-dark border-4 border-pixel-orange shadow-2xl">
                  <CardHeader>
                    <CardTitle className="text-pixel-orange font-pixel text-center text-2xl">
                      Игровое поле
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-8 gap-1 aspect-square max-w-2xl mx-auto bg-pixel-cream p-4 border-4 border-pixel-orange">
                      {ranks.map(rank => 
                        files.map(file => {
                          const square = file + rank;
                          const isLight = (files.indexOf(file) + ranks.indexOf(rank)) % 2 === 0;
                          const piece = board[square];
                          const selected = isSquareSelected(square);
                          
                          return (
                            <div
                              key={square}
                              onClick={() => handleSquareClick(square)}
                              className={`
                                aspect-square flex items-center justify-center text-4xl cursor-pointer
                                border-2 border-pixel-dark/20 font-pixel transition-all duration-300
                                ${isLight ? 'bg-pixel-cream' : 'bg-pixel-orange/30'}
                                ${selected ? 'bg-pixel-purple animate-pixel-glow' : ''}
                                ${piece ? 'hover:animate-bounce-piece' : ''}
                                hover:scale-105 hover:shadow-lg
                              `}
                            >
                              {piece && (
                                <span className={`
                                  ${selected ? 'animate-bounce-piece' : ''}
                                  ${piece.includes('♔♕♖♗♘♙') ? 'text-white' : 'text-pixel-dark'}
                                  drop-shadow-lg
                                `}>
                                  {piece}
                                </span>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Game Stats & Controls */}
              <div className="space-y-6">
                <Card className="bg-pixel-dark border-4 border-pixel-orange">
                  <CardHeader>
                    <CardTitle className="text-pixel-orange font-pixel">Статистика игры</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-white font-pixel">
                      <div className="flex justify-between">
                        <span>Ходов сделано:</span>
                        <Badge className="bg-pixel-orange">0</Badge>
                      </div>
                    </div>
                    <div className="text-white font-pixel">
                      <div className="flex justify-between">
                        <span>Время игры:</span>
                        <Badge className="bg-pixel-blue">00:00</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-pixel-dark border-4 border-pixel-orange">
                  <CardHeader>
                    <CardTitle className="text-pixel-orange font-pixel">Управление</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full bg-pixel-orange hover:bg-pixel-orange/80 font-pixel text-white border-2 border-white">
                      <Icon name="RotateCcw" size={16} className="mr-2" />
                      Отменить ход
                    </Button>
                    <Button className="w-full bg-pixel-blue hover:bg-pixel-blue/80 font-pixel text-white border-2 border-white">
                      <Icon name="Save" size={16} className="mr-2" />
                      Сохранить игру
                    </Button>
                    <Button className="w-full bg-pixel-purple hover:bg-pixel-purple/80 font-pixel text-white border-2 border-white">
                      <Icon name="RefreshCw" size={16} className="mr-2" />
                      Новая игра
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="mt-6">
            <Card className="bg-pixel-dark border-4 border-pixel-orange">
              <CardHeader>
                <CardTitle className="text-pixel-orange font-pixel text-2xl">Профиль игрока</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="text-white font-pixel">
                      <h3 className="text-pixel-cream text-lg mb-2">Статистика</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Игр сыграно:</span>
                          <Badge className="bg-pixel-orange">0</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Побед:</span>
                          <Badge className="bg-green-500">0</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Поражений:</span>
                          <Badge className="bg-red-500">0</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="text-white font-pixel">
                      <h3 className="text-pixel-cream text-lg mb-2">Достижения</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <Badge className="bg-pixel-blue text-xs p-2">🏆 Новичок</Badge>
                        <Badge className="bg-gray-500 text-xs p-2">🎯 Снайпер</Badge>
                        <Badge className="bg-gray-500 text-xs p-2">⚡ Молния</Badge>
                        <Badge className="bg-gray-500 text-xs p-2">🧠 Стратег</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Rules Tab */}
          <TabsContent value="rules" className="mt-6">
            <Card className="bg-pixel-dark border-4 border-pixel-orange">
              <CardHeader>
                <CardTitle className="text-pixel-orange font-pixel text-2xl">Правила игры</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-white font-pixel">
                <div className="space-y-3">
                  <h3 className="text-pixel-cream text-lg">Основные правила:</h3>
                  <ul className="space-y-2 list-disc list-inside">
                    <li>Клик по пешке - выбор</li>
                    <li>Клик на соседнюю клетку - перемещение</li>
                    <li>Цель - захватить все пешки противника</li>
                    <li>Белые ходят первыми</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h3 className="text-pixel-cream text-lg">Правила пешек:</h3>
                  <div className="space-y-2 text-sm">
                    <div>♙ Белые пешки - ходят в любом направлении на 1 клетку</div>
                    <div>♟ Черные пешки - ходят в любом направлении на 1 клетку</div>
                    <div>🎯 Цель: захватить все пешки противника</div>
                    <div>⚡ Можно ходить по диагонали, вперед, назад, в стороны</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Menu Tab */}
          <TabsContent value="menu" className="mt-6">
            <Card className="bg-pixel-dark border-4 border-pixel-orange">
              <CardHeader>
                <CardTitle className="text-pixel-orange font-pixel text-2xl">Главное меню</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button className="h-16 bg-pixel-orange hover:bg-pixel-orange/80 font-pixel text-white text-lg border-2 border-white">
                    <Icon name="Play" size={24} className="mr-3" />
                    Новая игра
                  </Button>
                  <Button className="h-16 bg-pixel-blue hover:bg-pixel-blue/80 font-pixel text-white text-lg border-2 border-white">
                    <Icon name="Upload" size={24} className="mr-3" />
                    Загрузить игру
                  </Button>
                  <Button className="h-16 bg-pixel-purple hover:bg-pixel-purple/80 font-pixel text-white text-lg border-2 border-white">
                    <Icon name="Users" size={24} className="mr-3" />
                    Мультиплеер
                  </Button>
                  <Button className="h-16 bg-pixel-cream hover:bg-pixel-cream/80 font-pixel text-pixel-dark text-lg border-2 border-pixel-dark">
                    <Icon name="Bot" size={24} className="mr-3" />
                    Против ИИ
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="mt-6">
            <Card className="bg-pixel-dark border-4 border-pixel-orange">
              <CardHeader>
                <CardTitle className="text-pixel-orange font-pixel text-2xl">Настройки</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-pixel-cream font-pixel text-lg">Графика</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-white font-pixel">
                        <span>Анимации:</span>
                        <Button className="bg-pixel-orange hover:bg-pixel-orange/80 text-xs">ВКЛ</Button>
                      </div>
                      <div className="flex justify-between items-center text-white font-pixel">
                        <span>Эффекты:</span>
                        <Button className="bg-pixel-orange hover:bg-pixel-orange/80 text-xs">ВКЛ</Button>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-pixel-cream font-pixel text-lg">Звук</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-white font-pixel">
                        <span>Музыка:</span>
                        <Button className="bg-pixel-blue hover:bg-pixel-blue/80 text-xs">ВЫКЛ</Button>
                      </div>
                      <div className="flex justify-between items-center text-white font-pixel">
                        <span>Эффекты:</span>
                        <Button className="bg-pixel-blue hover:bg-pixel-blue/80 text-xs">ВЫКЛ</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;