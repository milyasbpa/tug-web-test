import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('http://localhost/api/home/guide-cards', () => {
    return HttpResponse.json({
      data: [
        {
          id: 'guide-1',
          thumbnailSrc: 'https://picsum.photos/seed/guide1/600/340',
          videoSrc:
            'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        },
        {
          id: 'guide-2',
          thumbnailSrc: 'https://picsum.photos/seed/guide2/600/340',
          videoSrc:
            'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        },
        {
          id: 'guide-3',
          thumbnailSrc: 'https://picsum.photos/seed/guide3/600/340',
          videoSrc:
            'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        },
      ],
    });
  }),
];
