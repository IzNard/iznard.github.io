const profileStatusText = document.getElementById('profile-status-text');
  const activityContainer = document.getElementById('activity-container');
  const intro = document.getElementById('intro');
  const startBtn = document.getElementById('startBtn');
  const footerTip = document.getElementById('footerTip');
  const backTop = document.getElementById('backTop');
  const details = document.getElementById('details');
  const detailInner = document.getElementById('detailInner');
  const container = document.getElementById('three-container');
  const statusText = document.getElementById('status-text');
  const LANYARD_URL = "https://api.lanyard.rest/v1/users/964136170051211335";
  const discordStatusWidget = document.getElementById('discordStatus');
  let scene, camera, renderer, grid, planets = [], isZoomed = false;
  const boom = document.getElementById('backgroundMusic');
  let selectedPlanet = null;
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  const skillsData = {
    fisica: {
      name: "Physics",
      icon: "⚛️",
      color: 0x7df9ff,
      size: 8,
      distance: 0,
      speed: 0,
      content: `<h2>⚛️ Physics</h2>
        <div style="margin-top:30px">
          <div class="skill-block">
            <h3>Classical Mechanics</h3>
            <p>Deep specialization in the fundamental principles of motion and forces.</p>
          </div>
          
          <div class="skill-block">
            <h3>Electromagnetism</h3>
            <p>Understanding of electric and magnetic fields and their practical applications.</p>
          </div>
          
          <div class="skill-block">
            <h3>Special Relativity</h3>
            <p>Mastery of Einstein's theory of spacetime and velocities near the speed of light.</p>
          </div>
          
          <div class="skill-block">
            <h3>Orbital Mechanics</h3>
            <p>Calculation and optimization of trajectories for objects in orbit and space missions.</p>
          </div>
          
          <div class="skill-block">
            <h3>Atomic Theory</h3>
            <p>Knowledge of atomic structure and behavior of subatomic particles.</p>
          </div>
          
          <div class="skill-block">
            <h3>Propulsion</h3>
            <p>Design and analysis of propulsion systems for vehicles and spacecraft.</p>
          </div>
          
          <div class="skill-block">
            <h3>Aerodynamic Dynamics</h3>
            <p>Study of fluid motion and its interaction with solid surfaces.</p>
          </div>
          
          <div class="skill-block">
            <h3>Orbital Trajectory Optimization</h3>
            <p>Development of efficient routes for space missions minimizing energy consumption.</p>
          </div>
          
          <div class="skill-block">
            <h3>Computational Simulation</h3>
            <p>Creation of numerical models to predict complex physical behaviors.</p>
          </div>
          
          <h3 style="color:var(--muted);font-size:16px;margin-top:35px">Currently studying</h3>
          <p style="color:var(--muted)">General Relativity • Quantum Mechanics</p>
        </div>`
    },
    matematicas: {
      name: "Mathematics",
      icon: "∫",
      color: 0xff6b9d,
      size: 6,
      distance: 45,
      speed: 0.3,
      content: `<h2>∫ Mathematics</h2>
        <div style="margin-top:30px">
          <div class="skill-block">
            <h3>Calculus I, II and III</h3>
            <p>Complete mastery of limits, derivatives, integrals and series in multiple dimensions.</p>
          </div>
          
          <div class="skill-block">
            <h3>Vector Calculus</h3>
            <p>Analysis of vector fields, gradients, divergence and curl in multidimensional spaces.</p>
          </div>
          
          <div class="skill-block">
            <h3>Set Theory</h3>
            <p>Foundations of discrete mathematics, logic and algebraic structures.</p>
          </div>
          
          <div class="skill-block">
            <h3>Geometry</h3>
            <p>Deep understanding of shapes, spaces and their properties in different dimensions.</p>
          </div>
          
          <div class="skill-block">
            <h3>Trigonometry</h3>
            <p>Mastery of trigonometric functions and their applications in physics and engineering.</p>
          </div>
          
          <div class="skill-block">
            <h3>Algebra</h3>
            <p>Manipulation of algebraic expressions, equations and complex systems.</p>
          </div>
          
          <div class="skill-block">
            <h3>Tensor Calculus</h3>
            <p>Advanced analysis using tensors for theoretical physics and general relativity.</p>
          </div>
        </div>`
    },
    programacion: {
      name: "Programming",
      icon: "💻",
      color: 0xffd43b,
      size: 5,
      distance: 70,
      speed: 0.2,
      content: `<h2>💻 Programming</h2>
        <div style="margin-top:30px">
          <div class="skill-block">
            <h3>Cybersecurity in Python</h3>
            <p>Specialized development of security tools, vulnerability analysis and ethical hacking.</p>
          </div>
          
          <div class="skill-block">
            <h3>C Language</h3>
            <p>Low-level programming, memory management and performance optimization.</p>
          </div>
          
          <h3 style="margin-top:35px;color:var(--accent)">Featured Projects</h3>
          
          <div class="skill-block">
            <h3>Advanced Calculator</h3>
            <p>Mathematical tool with support for indefinite integrals, symbolic derivatives and unconventional functions.</p>
          </div>
          
          <div class="skill-block">
            <h3>Cybersecurity Suite</h3>
            <p>Secure password generator, strength analyzer and web page status checker.</p>
          </div>
          
          <div class="skill-block">
            <h3>Numeric Converter</h3>
            <p>Bidirectional conversion between binary and decimal systems with intuitive interface.</p>
          </div>
          
          <div class="skill-block">
            <h3>Application Launcher</h3>
            <p>Custom quick access to Windows Start Menu.</p>
          </div>
          
          <h3 style="margin-top:35px;color:var(--accent)">Contributions</h3>
          <p>• AI Discord Bot with natural language processing<br>• RAT (Remote Access Trojan) tool for security research</p>
        </div>`
    }
  };
  startBtn.addEventListener('click', () => {
    const backgroundMusic = new Audio('boom.mp3'); 
    backgroundMusic.volume = 0.5;
    
    // 5. Play the audio
    backgroundMusic.play().catch(error => {
        console.error("Audio playback failed:", error);
    });
    initThreeJS();
    
});
  function createBigBang() {
    const particleCount = 300;
    const btnRect = startBtn.getBoundingClientRect();
    const centerX = btnRect.left + btnRect.width / 2;
    const centerY = btnRect.top + btnRect.height / 2;

    const sphere = document.createElement('div');
    sphere.style.position = 'absolute';
    sphere.style.left = centerX + 'px';
    sphere.style.top = centerY + 'px';
    sphere.style.width = '20px';
    sphere.style.height = '20px';
    sphere.style.borderRadius = '50%';
    sphere.style.background = 'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,230,100,0.8) 40%, rgba(255,200,50,0) 100%)';
    sphere.style.boxShadow = '0 0 60px 30px rgba(255,255,255,0.8), 0 0 100px 50px rgba(255,230,100,0.6)';
    sphere.style.transform = 'translate(-50%, -50%)';
    sphere.style.pointerEvents = 'none';
    intro.appendChild(sphere);

    let sphereScale = 1;
    let sphereOpacity = 1;
    const animateSphere = () => {
      sphereScale += 0.15;
      sphereOpacity -= 0.008;
      sphere.style.transform = `translate(-50%, -50%) scale(${sphereScale})`;
      sphere.style.opacity = sphereOpacity;
      if (sphereOpacity > 0) {
        requestAnimationFrame(animateSphere);
      } else {
        sphere.remove();
      }
    };
    requestAnimationFrame(animateSphere);
  
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      const isWhite = Math.random() > 0.3;
      particle.style.background = isWhite ? '#ffffff' : '#ffeb3b';
      particle.style.left = centerX + 'px';
      particle.style.top = centerY + 'px';
      particle.style.boxShadow = `0 0 20px ${isWhite ? '#ffffff' : '#ffeb3b'}, 0 0 40px ${isWhite ? 'rgba(255,255,255,0.6)' : 'rgba(255,235,59,0.6)'}`;
      intro.appendChild(particle);

      const angle = (Math.PI * 2 * i) / particleCount + Math.random() * 0.5;
      const velocity = 4 + Math.random() * 10;
      const dx = Math.cos(angle) * velocity;
      const dy = Math.sin(angle) * velocity;

      let x = 0, y = 0, opacity = 1, scale = 1;

      const animate = () => {
        x += dx;
        y += dy;
        opacity -= 0.012;
        scale += 0.03;

        particle.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
        particle.style.opacity = opacity;

        if (opacity > 0) {
          requestAnimationFrame(animate);
        } else {
          particle.remove();
        }
      };
      
      requestAnimationFrame(animate);
    }
    discordStatusWidget.classList.add('visible');
  };
  const avatar = document.getElementById('discordAvatar');
const lanyardUsername = document.getElementById('lanyardUsername');
const lanyardDiscordTag = document.getElementById('lanyardDiscordTag');
const lanyardServerTag = document.getElementById('lanyardServerTag');
const statusIcon = document.getElementById('statusIcon');
const activitySection = document.getElementById('activitySection');
const activityWrapper = document.getElementById('activityWrapper');

const statusMap = {
    online: { color: '#23a55a', icon: '●', text: 'Online' },
    idle: { color: '#f0b232', icon: '●', text: 'Away' },
    dnd: { color: '#f23f43', icon: '⦸', text: 'Do Not Disturb' },
    offline: { color: '#80848e', icon: '●', text: 'Offline' }
};

function updateDiscordStatus(data) {
    const container = document.getElementById('discordStatus');
    const user = data.discord_user;
    const status = data.discord_status;
    const activities = data.activities || [];

    const avatarUrl = user.avatar 
        ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=128`
        : `https://cdn.discordapp.com/embed/avatars/${user.discriminator % 5}.png`;

    const statusInfo = statusMap[status] || statusMap.offline;

    let activitiesHTML = '';

    const spotifyActivity = activities.find(a => a.id === 'spotify:1');
    const gameActivities = activities.filter(a => a.type === 0 && a.id !== 'spotify:1');
    const customStatus = activities.find(a => a.type === 4);
    const mainProfilePic = document.querySelector('.profile-pic img');
    if (mainProfilePic) {
        mainProfilePic.src = avatarUrl;
    }
    if (spotifyActivity) {
        const albumArt = spotifyActivity.assets?.large_image 
            ? `https://i.scdn.co/image/${spotifyActivity.assets.large_image.replace('spotify:', '')}`
            : 'https://open.spotify.com/favicon.ico';

        activitiesHTML += `
            <div class="activity-card spotify-activity">
                <div class="activity-image">
                    <img src="${albumArt}" alt="Album Art" onerror="this.src='https://open.spotify.com/favicon.ico'">
                </div>
                <div class="activity-details">
                    <div class="activity-name">
                        <i class="fab fa-spotify"></i> Listening to Spotify
                    </div>
                    <div class="activity-description">
                        <strong>${spotifyActivity.details || 'Unknown Track'}</strong><br>
                        by ${spotifyActivity.state || 'Unknown Artist'}
                    </div>
                    ${spotifyActivity.sync_id ? `
                        <a href="https://open.spotify.com/track/${spotifyActivity.sync_id}" target="_blank" class="spotify-link">
                            <i class="fas fa-external-link-alt"></i> Open in Spotify
                        </a>
                    ` : ''}
                </div>
            </div>
        `;
    }

    gameActivities.forEach(activity => {
        const imageUrl = activity.assets?.large_image
            ? `https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity.assets.large_image}.png`
            : 'https://via.placeholder.com/48x48/36393f/ffffff?text=Game';

        activitiesHTML += `
            <div class="activity-card game-activity">
                <div class="activity-image">
                    <img src="${imageUrl}" alt="${activity.name}" onerror="this.src='https://via.placeholder.com/48x48/36393f/ffffff?text=Game'">
                </div>
                <div class="activity-details">
                    <div class="activity-name">
                        <i class="fas fa-gamepad"></i> Playing ${activity.name}
                    </div>
                    <div class="activity-description">
                        ${activity.details || ''}${activity.details && activity.state ? '<br>' : ''}${activity.state || ''}
                    </div>
                </div>
            </div>
        `;
    });

    if (customStatus && customStatus.state) {
        activitiesHTML += `
            <div class="activity-card custom-status">
                <div class="activity-image">
                    ${customStatus.emoji ? 
                        (customStatus.emoji.id ? 
                            `<img src="https://cdn.discordapp.com/emojis/${customStatus.emoji.id}.png" alt="${customStatus.emoji.name}">` :
                            `<div style="font-size: 24px; display: flex; align-items: center; justify-content: center; height: 100%;">${customStatus.emoji.name}</div>`
                        ) : 
                        '<div style="font-size: 24px; display: flex; align-items: center; justify-content: center; height: 100%;">💭</div>'
                    }
                </div>
                <div class="activity-details">
                    <div class="activity-name">
                        <i class="fas fa-comment-dots"></i> Custom Status
                    </div>
                    <div class="activity-description">
                        ${customStatus.state}
                    </div>
                </div>
            </div>
        `;
    }

    if (!activitiesHTML) {
        activitiesHTML = `
            <div class="activity-card" style="opacity: 0.6; border-style: dashed;">
                <div class="activity-image" style="background: rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center;">
                    <i class="fas fa-moon" style="font-size: 20px; color: #72767d;"></i>
                </div>
                <div class="activity-details">
                    <div class="activity-name" style="color: #72767d;">
                        <i class="fas fa-bed"></i> Currently idle
                    </div>
                    <div class="activity-description">
                        Not doing anything interesting right now
                    </div>
                </div>
            </div>
        `;
    }

    container.innerHTML = `
        <div class="discord-header">
            <div class="discord-avatar">
                <img src="${avatarUrl}" alt="Avatar" onerror="this.src='https://via.placeholder.com/64x64/36393f/ffffff?text=${user.username.charAt(0)}'">
                <div class="status-indicator status-${status}" title="${statusInfo.text}">
                    ${statusInfo.icon}
                </div>
            </div>
            <div class="discord-info">
                <h3>${user.global_name || user.display_name || user.username}</h3>
                <div class="username">@${user.username}${user.discriminator !== '0' ? `#${user.discriminator}` : ''}</div>
                <div class="status-text">${statusInfo.text}</div>
            </div>
        </div>
        <div class="activities-container">
            ${activitiesHTML}
        </div>
    `;
    dynamicFavicon.updateWithDiscordData(data);
}
  function updateWithDiscordData(discordData) {
        const user = discordData.discord_user;
        const status = discordData.discord_status;

        const statusColors = {
            online: '#23a55a',
            idle: '#f0b232',
            dnd: '#f23f43',
            offline: '#80848e'
        };

        const avatarUrl = user.avatar 
            ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=64`
            : null;

        if (avatarUrl) {
            this.createCircularFavicon(avatarUrl, statusColors[status]);
        } else {
            this.createTextFavicon('1Y', '#000000', '#00ff00');
        }

        this.updateTitleForStatus(status);
    }
    
  function fetchLanyardData() {
    fetch('https://api.lanyard.rest/v1/users/964136170051211335')
        .then(res => res.json())
        .then(res => updateWithDiscordData(res.data))
        .catch(() => {});
    activitiesHTML = '';
}

function updateProfile(data) {
    updateDiscordStatus(data);
}

function updateStatus(status) {
    const info = statusMap[status] || statusMap.offline;
    statusIcon.textContent = info.icon;
    statusIcon.style.color = info.color;
}
function updateActivities(activities) {
    activitySection.innerHTML = '';
    const spotifyActivity = activities.find(a => a.id === 'spotify:1');
    const gameActivities = activities.filter(a => a.type === 0);
    if (spotifyActivity) createSpotifyCard(spotifyActivity);
    gameActivities.forEach(createActivityCard);
    if (spotifyActivity || gameActivities.length > 0) {
        activityWrapper.classList.remove('hidden');
    } else {
        activityWrapper.classList.add('hidden');
    }
}
function createSpotifyCard(activity) {
    const albumArtUrl = `https://i.scdn.co/image/${activity.assets.large_image.replace('spotify:', '')}`;
    const song = activity.details;
    const artist = activity.state;
    const url = activity.sync_id;
    activitySection.insertAdjacentHTML('beforeend', `
        <div class="spotify-card">
            <img src="${albumArtUrl}" alt="Album Art" style="width:64px;height:64px;border-radius:8px;">
            <div>
                <strong>Listening to Spotify</strong><br>
                <span>${song} by ${artist}</span><br>
                <a href="https://open.spotify.com/track/${url}" target="_blank">Open in Spotify</a>
            </div>
        </div>
    `);
}

function createActivityCard(activity) {
    let imageUrl = 'https://placehold.co/64x64/2c3e50/ffffff?text=Game';
    if (activity.assets && activity.assets.large_image) {
        imageUrl = `https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity.assets.large_image}.png`;
    }
    activitySection.insertAdjacentHTML('beforeend', `
        <div class="activity-card">
            <img src="${imageUrl}" alt="App" style="width:64px;height:64px;border-radius:8px;">
            <div>
                <strong>${activity.name}</strong><br>
                <span>${activity.details || ''}</span><br>
                <span>${activity.state || ''}</span>
            </div>
        </div>
    `);
}

function fetchLanyardData() {
    fetch('https://api.lanyard.rest/v1/users/964136170051211335')
        .then(res => res.json())
        .then(res => updateProfile(res.data))
        .catch(() => {});
}
fetchLanyardData();
setInterval(fetchLanyardData, 15000);
function initThreeJS() {
    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer({antialias:true, alpha:true, premultipliedAlpha: false});
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);
    
    camera = new THREE.PerspectiveCamera(50, window.innerWidth/window.innerHeight, 0.1, 1000);
    camera.position.set(0, 80, 120);
    camera.lookAt(0, 0, 0);
    
    const ambient = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambient);
    
    const dir = new THREE.DirectionalLight(0xffffff, 0.6);
    dir.position.set(20, 50, 30);
    scene.add(dir);

    createSpacetimeGrid();
    createPlanets();
    animate();

    renderer.domElement.addEventListener('click', onMouseClick);
    window.addEventListener('resize', onWindowResize);
    backTop.addEventListener('click', resetView);
    fetchLanyardData();
    setInterval(fetchLanyardData, 10000);
}

  function createSpacetimeGrid() {
    const GRID_SIZE = 500;
    const GRID_SEG = 200;
    const geom = new THREE.PlaneGeometry(GRID_SIZE, GRID_SIZE, GRID_SEG, GRID_SEG);
    geom.rotateX(-Math.PI/2);
    
    const vertices = geom.attributes.position;
    for (let i = 0; i < vertices.count; i++) {
      const x = vertices.getX(i);
      const z = vertices.getZ(i);
      let y = 0;
      
      const distPhysics = Math.sqrt(x*x + z*z);
      y -= 15 / (1 + distPhysics * 0.15);
      
      Object.keys(skillsData).forEach(key => {
        if (key !== 'fisica') {
          const skill = skillsData[key];
          const angle = skill.speed * Date.now() * 0.001;
          const px = Math.cos(angle) * skill.distance;
          const pz = Math.sin(angle) * skill.distance;
          const dist = Math.sqrt((x-px)*(x-px) + (z-pz)*(z-pz));
          const mass = skill.size * 0.8;
          y -= mass / (1 + dist * 0.2);
        }
      });
      
      vertices.setY(i, y);
    }
    
    const mat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vPos; 
        void main(){ 
          vPos = position; 
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); 
        }`,
      fragmentShader: `
        varying vec3 vPos; 
        void main(){ 
          float dist2 = length(vPos.xz); 
          float edgeFade = 1.0 - smoothstep(200.0, 250.0, dist2); 
          gl_FragColor = vec4(1.0, 1.0, 1.0, edgeFade * 0.6); 
        }`,
      transparent: true, 
      wireframe: true,
      depthWrite: false
    });
    
    grid = new THREE.Mesh(geom, mat);
    grid.userData.isGrid = true;
    scene.add(grid);
  }

  function createPlanets() {
    Object.keys(skillsData).forEach(key => {
      const skill = skillsData[key];
      
      const group = new THREE.Group();
      
      const circleCanvas = document.createElement('canvas');
      circleCanvas.width = 512;
      circleCanvas.height = 512;
      const circleCtx = circleCanvas.getContext('2d');
      
      circleCtx.clearRect(0, 0, 512, 512);
      
      circleCtx.beginPath();
      circleCtx.arc(256, 256, 240, 0, Math.PI * 2);
      circleCtx.fillStyle = `rgba(${(skill.color >> 16) & 255}, ${(skill.color >> 8) & 255}, ${skill.color & 255}, 0.3)`;
      circleCtx.fill();
      
      circleCtx.strokeStyle = `rgba(${(skill.color >> 16) & 255}, ${(skill.color >> 8) & 255}, ${skill.color & 255}, 0.6)`;
      circleCtx.lineWidth = 8;
      circleCtx.stroke();
      
      const circleTexture = new THREE.CanvasTexture(circleCanvas);
      circleTexture.needsUpdate = true;
      const circleSpriteMat = new THREE.SpriteMaterial({
        map: circleTexture, 
        transparent: true,
        opacity: 1,
        depthTest: true,
        depthWrite: false,
        blending: THREE.NormalBlending
      });
      const circleSprite = new THREE.Sprite(circleSpriteMat);
      circleSprite.scale.set(skill.size * 2.2, skill.size * 2.2, 1);
      circleSprite.renderOrder = 0;
      group.add(circleSprite);
      
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');
      
      const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
      gradient.addColorStop(0, `rgba(${(skill.color >> 16) & 255}, ${(skill.color >> 8) & 255}, ${skill.color & 255}, 0.4)`);
      gradient.addColorStop(0.5, `rgba(${(skill.color >> 16) & 255}, ${(skill.color >> 8) & 255}, ${skill.color & 255}, 0.2)`);
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 256, 256);
      
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
      ctx.shadowBlur = 20;
      ctx.font = 'bold 140px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(skill.icon, 128, 138);
      
      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      const spriteMat = new THREE.SpriteMaterial({
        map: texture, 
        transparent: true,
        opacity: 1,
        depthTest: true,
        depthWrite: false,
        blending: THREE.NormalBlending
      });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.scale.set(skill.size * 1.5, skill.size * 1.5, 1);
      sprite.position.z = 0.1;
      sprite.renderOrder = 1;
      group.add(sprite);
      
      group.userData.skill = key;
      group.userData.skillData = skill;
      group.userData.sprite = sprite;
      group.userData.circleSprite = circleSprite;
      
      scene.add(group);
      planets.push(group);
    });
  }

  function animate() {
    requestAnimationFrame(animate);
    
    if (!isZoomed) {
      const time = Date.now() * 0.001;
      
      planets.forEach(planet => {
        const skill = planet.userData.skillData;
        if (skill.distance === 0) {
          planet.position.set(0, 0, 0);
        } else {
          const angle = time * skill.speed;
          planet.position.x = Math.cos(angle) * skill.distance;
          planet.position.z = Math.sin(angle) * skill.distance;
          planet.position.y = 0;
        }
      });
      
      if (grid) {
        const vertices = grid.geometry.attributes.position;
        for (let i = 0; i < vertices.count; i++) {
          const x = vertices.getX(i);
          const z = vertices.getZ(i);
          let y = 0;
          
          planets.forEach(planet => {
            const px = planet.position.x;
            const pz = planet.position.z;
            const dist = Math.sqrt((x-px)*(x-px) + (z-pz)*(z-pz));
            const mass = planet.userData.skillData.size * (planet.userData.skill === 'fisica' ? 1.5 : 0.8);
            y -= mass / (1 + dist * 0.2);
          });
          
          vertices.setY(i, y);
        }
        vertices.needsUpdate = true;
      }
    }
    
    renderer.render(scene, camera);
  }

  function onMouseClick(event) {
    if (isZoomed) return;
    
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(planets, true);
    
    if (intersects.length > 0) {
      let planet = intersects[0].object;
      while (planet && !planet.userData.skillData) {
        planet = planet.parent;
      }
      if (planet && planet.userData.skillData) {
        zoomToPlanet(planet);
      }
    }
  }

  function zoomToPlanet(planet) {
    isZoomed = true;
    selectedPlanet = planet;
    selectedPlanet.userData.originalX = planet.position.x;
    selectedPlanet.userData.originalZ = planet.position.z;
    const targetPos = planet.position.clone();
    
    planets.forEach(p => {
      if (p !== planet) p.visible = false;
    });
    if (grid) grid.visible = false;
    document.getElementById('discordStatus').classList.remove('visible');
    
    const startPos = camera.position.clone();
    const endPos = new THREE.Vector3(targetPos.x, targetPos.y, targetPos.z + 40);
    const startTime = Date.now();
    const duration = 1000;
    
    const startPlanetX = targetPos.x;
    const endPlanetX = targetPos.x - 20;
    
    function animateCamera() {
      const elapsed = Date.now() - startTime;
      const t = Math.min(elapsed / duration, 1);
      const eased = t < 0.5 ? 2*t*t : -1+(4-2*t)*t;
      
      camera.position.lerpVectors(startPos, endPos, eased);
      camera.lookAt(targetPos);
      
      planet.position.x = startPlanetX + (endPlanetX - startPlanetX) * eased;
      
      if (t < 1) {
        requestAnimationFrame(animateCamera);
      } else {
        showDetails(planet.userData.skillData);
      }
    }
    animateCamera();
  }

  function showDetails(skillData) {
    detailInner.innerHTML = skillData.content;
    details.classList.add('open');
    backTop.classList.add('visible');
  }

  function resetView() {
    isZoomed = false;
    details.classList.remove('open');
    backTop.classList.remove('visible');
    
    planets.forEach(p => p.visible = true);
    if (grid) grid.visible = true;
    
    
    const startCamPos = camera.position.clone(); 
    const endCamPos = new THREE.Vector3(0, 80, 120); 
    
    const endTarget = new THREE.Vector3(0, 0, 0); 
    
    const startTime = Date.now();
    const duration = 1000;
    
    let startPlanetX = 0;
    let endPlanetX = 0;
    
    if (selectedPlanet) {
        startPlanetX = selectedPlanet.position.x;
        endPlanetX = selectedPlanet.userData.originalX;
    }
    
    const currentTarget = new THREE.Vector3();
    
    
    function animateCamera() {
        const elapsed = Date.now() - startTime;
        const t = Math.min(elapsed / duration, 1);
        const eased = t < 0.5 ? 2*t*t : -1+(4-2*t)*t;
        
        camera.position.lerpVectors(startCamPos, endCamPos, eased);

        if (selectedPlanet) {
            selectedPlanet.position.x = startPlanetX + (endPlanetX - startPlanetX) * eased;
        }
        
        if (selectedPlanet) {
            currentTarget.lerpVectors(selectedPlanet.position, endTarget, eased);
        } else {
            currentTarget.copy(endTarget);
        }
        
        camera.lookAt(currentTarget);
        
        if (t < 1) {
            requestAnimationFrame(animateCamera);
        } else {
            planets.forEach(p => p.visible = true);
            if (grid) grid.visible = true;
            
            selectedPlanet = null; 
            
            fetchLanyardData(); 
        }
    } 
    animateCamera();
  }
  

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
class DynamicFavicon {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 32;
        this.canvas.height = 32;
        this.currentFavicon = null;

        this.originalTitle = 'iznard';
        this.animatedTitles = [
            '◢ iznard ◣',
            '◤ iznard ◥',
            '▲ iznard ▲',
            '▼ iznard ▼',
            '◆ iznard ◆',
            '● iznard ●',
            '■ iznard ■',
            '▶ iznard ◀',
            '♦ iznard ♦',
            '⬢ iznard ⬢'
        ];
        this.titleIndex = 0;
        this.titleInterval = null;

        this.init();
    }

    init() {

        this.startTitleAnimation();

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.showNotificationTitle();
            } else {
                this.startTitleAnimation();
            }
        });
    }

    createCircularFavicon(imageUrl, statusColor = null) {
        return new Promise((resolve) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';

            img.onload = () => {

                this.ctx.clearRect(0, 0, 32, 32);

                this.ctx.beginPath();
                this.ctx.arc(16, 16, 15, 0, 2 * Math.PI);
                this.ctx.fillStyle = '#36393f';
                this.ctx.fill();

                this.ctx.save();
                this.ctx.beginPath();
                this.ctx.arc(16, 16, 14, 0, 2 * Math.PI);
                this.ctx.clip();

                this.ctx.drawImage(img, 1, 1, 30, 30);
                this.ctx.restore();

                if (statusColor) {
                    this.ctx.beginPath();
                    this.ctx.arc(24, 24, 4, 0, 2 * Math.PI);
                    this.ctx.fillStyle = '#000000';
                    this.ctx.fill();

                    this.ctx.beginPath();
                    this.ctx.arc(24, 24, 3, 0, 2 * Math.PI);
                    this.ctx.fillStyle = statusColor;
                    this.ctx.fill();
                }

                const dataUrl = this.canvas.toDataURL('image/png');
                this.updateFavicon(dataUrl);
                resolve(dataUrl);
            };

            img.onerror = () => {

                this.createTextFavicon('IZ');
                resolve(null);
            };

            img.src = imageUrl;
        });
    }

    createTextFavicon(text, bgColor = '#000000', textColor = '#00ff00') {
        this.ctx.clearRect(0, 0, 32, 32);

        this.ctx.fillStyle = bgColor;
        this.ctx.fillRect(0, 0, 32, 32);

        this.ctx.strokeStyle = '#333333';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(0, 0, 32, 32);

        this.ctx.fillStyle = textColor;
        this.ctx.font = 'bold 12px "JetBrains Mono", monospace';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(text, 16, 16);

        const dataUrl = this.canvas.toDataURL('image/png');
        this.updateFavicon(dataUrl);
        return dataUrl;
    }

    updateFavicon(dataUrl) {

        const existingFavicon = document.querySelector('link[rel="icon"], link[rel="shortcut icon"]');
        if (existingFavicon) {
            existingFavicon.remove();
        }

        const link = document.createElement('link');
        link.rel = 'icon';
        link.type = 'image/png';
        link.href = dataUrl;
        document.head.appendChild(link);

        this.currentFavicon = dataUrl;
    }

    startTitleAnimation() {
        if (this.titleInterval) {
            clearInterval(this.titleInterval);
        }

        this.titleInterval = setInterval(() => {
            document.title = this.animatedTitles[this.titleIndex];
            this.titleIndex = (this.titleIndex + 1) % this.animatedTitles.length;
        }, 800);
    }

    showNotificationTitle() {
        if (this.titleInterval) {
            clearInterval(this.titleInterval);
        }

        let isVisible = true;
        this.titleInterval = setInterval(() => {
            document.title = isVisible ? '🔴 iznard - Come back!' : '● iznard - New activity';
            isVisible = !isVisible;
        }, 1000);
    }

    updateWithDiscordData(discordData) {
        const user = discordData.discord_user;
        const status = discordData.discord_status;

        const statusColors = {
            online: '#23a55a',
            idle: '#f0b232',
            dnd: '#f23f43',
            offline: '#80848e'
        };

        const avatarUrl = user.avatar 
            ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=64`
            : null;

        if (avatarUrl) {
            this.createCircularFavicon(avatarUrl, statusColors[status]);
        } else {
            this.createTextFavicon('IZ', '#000000', '#00ff00');
        }

        this.updateTitleForStatus(status);
    }

    updateTitleForStatus(status) {
        const statusTitles = {
            online: [
                '🟢 iznard - Online',
                '💚 iznard - Active',
                '✅ iznard - Ready',
                '🔥 iznard - Coding'
            ],
            idle: [
                '🟡 iznard - Away',
                '😴 iznard - Idle',
                '⏰ iznard - BRB'
            ],
            dnd: [
                '🔴 iznard - Busy',
                '⛔ iznard - Do not disturb',
                '🎯 iznard - Focused',
                '💼 iznard - Working'
            ],
            offline: [
                '⚫ iznard - Offline',
                '📵 iznard - Disconnected'
            ]
        };

        if (statusTitles[status]) {
            this.animatedTitles = statusTitles[status];
            this.titleIndex = 0;
        }
    }
}

const dynamicFavicon = new DynamicFavicon();

dynamicFavicon.createTextFavicon('IZ', '#000000', '#00ff00');

