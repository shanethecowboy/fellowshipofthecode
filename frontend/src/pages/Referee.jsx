const sections = [
  {
    photo: '/intramural-bg.jpeg',
    videos: [
      { title: 'Flag Training Video 2', src: '/videos/Flag training video 2.mp4' },
    ],
  },
  {
    photo: '/intramural-bg2.jpeg',
    videos: [
      { title: 'Flag Training Video 3', src: '/videos/Flag trainning 3.mp4' },
    ],
  },
  {
    photo: '/intramural-bg3.jpeg',
    videos: [
      { title: 'Flag Training Video 4', src: '/videos/Flag training 4.mp4' },
    ],
  },
  {
    photo: '/intramural-bg4.jpeg',
    videos: [
      { title: 'Flag Training Video 6', src: '/videos/Flag Trainging 6.mp4' },
    ],
  },
  {
    photo: '/intramural-bg5.jpeg',
    videos: [],
  },
]

function Referee() {
  return (
    <div className="referee-page">
      <div className="referee-header">
        <h1>Intramural Referee</h1>
        <p className="subtitle">Training videos to help you become a better referee.</p>
      </div>
      {sections.map((section, i) => (
        <div key={i} className="referee-section">
          <div className="section-photo">
            <img src={section.photo} alt={`Intramural photo ${i + 1}`} />
          </div>
          {section.videos.length > 0 && (
            <div className="section-content">
              {section.videos.map(({ title, src }) => (
                <div key={src} className="video-item">
                  <h2>{title}</h2>
                  <video controls>
                    <source src={src} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default Referee
