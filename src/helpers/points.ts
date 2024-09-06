import { Point, Sprite } from "pixi.js";

export function getSpriteContourPoints(sprite: any, threshold = 0.5): Point[] {
    const canvas = document.createElement('canvas');
    canvas.width = sprite.width;
    canvas.height = sprite.height;
    const ctx = canvas.getContext('2d');
    
    // Рисуем спрайт на канве
    ctx.drawImage(sprite.texture.baseTexture.resource, 0, 0);

    // Получаем данные пикселей
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    const contourPoints = [];

    // Перебираем все пиксели, чтобы найти контур
    for (let y = 1; y < canvas.height - 1; y++) {
        for (let x = 1; x < canvas.width - 1; x++) {
            const alphaIndex = (y * canvas.width + x) * 4 + 3;
            const alpha = data[alphaIndex];

            // Проверяем, если текущий пиксель непрозрачен, а один из соседних пикселей прозрачен, значит это контур
            if (alpha > threshold * 255) {
                const neighbors = [
                    data[((y - 1) * canvas.width + x) * 4 + 3], // верхний сосед
                    data[((y + 1) * canvas.width + x) * 4 + 3], // нижний сосед
                    data[(y * canvas.width + (x - 1)) * 4 + 3], // левый сосед
                    data[(y * canvas.width + (x + 1)) * 4 + 3]  // правый сосед
                ];

                // Если любой из соседей прозрачен, добавляем текущую точку в контур
                if (neighbors.some(neighborAlpha => neighborAlpha <= threshold * 255)) {
                    contourPoints.push(new Point(x, y));
                }
            }
        }
    }

    return contourPoints;
}

export function getSpriteContour(sprite: any, threshold = 0.5): number[] {
    const canvas = document.createElement('canvas');
    canvas.width = sprite.width;
    canvas.height = sprite.height;
    const ctx = canvas.getContext('2d');
    
    // Рисуем спрайт на канве
    ctx.drawImage(sprite.texture.baseTexture.resource, 0, 0);

    // Получаем данные пикселей
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    const contourPoints = [];

    // Перебираем все пиксели, чтобы найти контур
    for (let y = 1; y < canvas.height - 1; y++) {
        for (let x = 1; x < canvas.width - 1; x++) {
            const alphaIndex = (y * canvas.width + x) * 4 + 3;
            const alpha = data[alphaIndex];

            // Проверяем, если текущий пиксель непрозрачен, а один из соседних пикселей прозрачен, значит это контур
            if (alpha > threshold * 255) {
                const neighbors = [
                    data[((y - 1) * canvas.width + x) * 4 + 3], // верхний сосед
                    data[((y + 1) * canvas.width + x) * 4 + 3], // нижний сосед
                    data[(y * canvas.width + (x - 1)) * 4 + 3], // левый сосед
                    data[(y * canvas.width + (x + 1)) * 4 + 3]  // правый сосед
                ];

                // Если любой из соседей прозрачен, добавляем текущую точку в контур
                if (neighbors.some(neighborAlpha => neighborAlpha <= threshold * 255)) {
                    contourPoints.push(x, y);
                }
            }
        }
    }

    return contourPoints;
}

export function getCirclePoints(radius: number, centerX: number, centerY: number, numPoints: number): Point[] {
    const points = [];
    const angleStep = 360 / numPoints; // Угловое смещение между точками

    for (let i = 0; i < numPoints; i++) {
        const angleInRadians = (i * angleStep) * (Math.PI / 180); // Переводим угол в радианы
        const x = centerX + radius * Math.cos(angleInRadians);
        const y = centerY + radius * Math.sin(angleInRadians);
        points.push(new Point(x, y));
    }

    return points;
}

export function getGlobal(points: Point[], sprite: Sprite): Point[] {
    const globalPoints = points.map((point: any) => sprite.toGlobal(point));
    return globalPoints;
}

export function getRandomItemIndex<T>(array: T[]): number | undefined {
    const randomIndex = Math.floor(Math.random() * array.length);
    return randomIndex;
}