export const styles = `

@keyframes loop {
  to {
    transform: rotate(360deg);
    -webkit-transform: rotate(360deg);
  }
}

@-webkit-keyframes loop {
  to {
    transform: rotate(360deg);
    -webkit-transform: rotate(360deg);
  }
}

.wt-loading-card {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}


.wt-loading-card .spinner {
  display: inline-block;
  width: 18px;
  height: 18px;
  border: 3px solid rgba(34,45,82,0.5);
  border-radius: 50%;
  border-top-color: transparent;
  animation: loop 1s linear infinite !important;
  -webkit-animation: loop 1s linear infinite !important;
  opacity: 1;
}


.wt-container {
    visibility: hidden;
    opacity: 0;
    transition: 0.2s;
    pointer-events: none;
    min-width: 300px;
    min-height: 200px;
    background: white;
    border-radius: 10px;
    box-shadow: 0px 1px 3px 0px rgba(34,45,82,0.1), 0px 10px 10px 0px rgba(34,45,82,0.1);
    top: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.wt-container.opened {
    opacity: 1;
    visibility: visible !important;
    pointer-events: auto;
    z-index: 1;
    margin-bottom: 0;
    top: 0;
}
`;
